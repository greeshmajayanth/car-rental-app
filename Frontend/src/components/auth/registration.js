import React, { Component } from 'react';
import withRouter from "../../withRouter";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../App.css';

class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            userRole: 'customer',
            isValidEmail: true // Added state for email validation
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    handleFirstNameChange = (e) => {
        this.setState({ firstName: e.target.value });
    };

    handleLastNameChange = (e) => {
        this.setState({ lastName: e.target.value });
    };

    handleEmailChange = (e) => {
        const email = e.target.value;
        this.setState({ email, isValidEmail: this.validateEmail(email) });
    };

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    };

    handleConfirmPasswordChange = (e) => {
        this.setState({ confirmPassword: e.target.value });
    };

    validateForm = () => {
        const { firstName, lastName, email, password, confirmPassword } = this.state;
        return firstName && lastName && email && password && confirmPassword;
    };

    validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(this.state.email);
        return isEmailValid
    }

    validatePassword = () => {
        const passwordRegex = /^(?=.*[A-Za-z]{4,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        const isPasswordValid = passwordRegex.test(this.state.password);
        return isPasswordValid
    }

    validateConfirmPassword = () => {
        if (this.state.password !== this.state.confirmPassword){
            return false
        } else {
            return true
        }
    }

    validateFirstName = () => {
        const hasNumbersInFirstName = /\d/.test(this.state.firstName);
        const isFirstNameValid = !hasNumbersInFirstName;
        return isFirstNameValid
    }

    validateLastName = () => {
        const hasNumbersInLastName = /\d/.test(this.state.lastName);
        const isLastNameValid = !hasNumbersInLastName;
        return isLastNameValid
    }

    onSubmit = async (event) => {

        event.preventDefault(); 

        if (!this.validateForm()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!this.validateEmail()) {
            toast.error('Please enter valid email');
            return;
        }

        if (!this.validatePassword()) {
            toast.error('Password should contain at least 4 alphabets, 1 number and 1 special character');
            return;
        }

        if (!this.validateConfirmPassword()) {
            toast.error('Password does not match confirm password');
            return;
        }

        if (!this.validateFirstName()) {
            toast.error('Name cannot have numbers or special characters');
            return;
        }

        if (!this.validateLastName()) {
            toast.error('Name cannot have numbers or special characters');
            return;
        }

        const { firstName, lastName, email, password, userRole} = this.state;

        // Proceed with form submission
        const formData = { firstName, lastName, email, password, userRole };

        try {
            const response = await axios.post('http://localhost:3001/submit-form', formData);
        
            if (response.status === 200) {
                window.alert('Registered successfully');
                this.props.navigate('/')
            } else {
                // Handle other status codes, e.g., show an error message to the user
                console.error('Registration failed:', response.data.error);
            }
            } catch (error) {
            // Handle network or other errors
            console.error('Error during Registration:', error.message);
            }
    };
    

    render() {
        const { validateEmail } = this.state;

        return (
            <div className="login-form">
                <form>
                    <h1>REGISTRATION</h1>
                    <div className="content">
                        <div className="content">
                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    autoComplete="nope"
                                    value={this.state.firstName}
                                    onChange={this.handleFirstNameChange}
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    autoComplete="nope"
                                    value={this.state.lastName}
                                    onChange={this.handleLastNameChange}
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="nope"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                    className={!validateEmail ? 'invalid' : ''}
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="nope"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    autoComplete="nope"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleConfirmPasswordChange}
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="user">USER:</label>
                                <label htmlFor='user'>CUSTOMER</label>
                            </div>
                        </div>
                    </div>
                    <div className="action">
                        <button onClick={this.onSubmit} type="button" className="submit-button">
                            Submit
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        );
    }
}

export default withRouter(RegistrationForm);
