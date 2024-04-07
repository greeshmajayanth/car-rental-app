import React, { Component } from "react";
import withRouter from "../../withRouter";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import "../../App.css";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userRole: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value }, this.checkFormValidity);
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value }, this.checkFormValidity);
  };

  onSubmit() {
    const { navigate } = this.props;
    navigate("/registration");
  }

  validateForm = () => {
    const { email, password } = this.state;
    return email && password;
  };

  onLogin = async (event) => {
    event.preventDefault(); 
    const { email, password } = this.state;

    if (!this.validateForm()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        window.alert("Logged in successfully");
        this.redirectBasedOnUserRole(response.data);
      } else {
        // Handle other status codes, e.g., show an error message to the user
        window.alert('Login failed:', response.data.error);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error during login:', error.message);
    }
  };

  redirectBasedOnUserRole = (customerData) => {
    const { navigate } = this.props;
    const userRole = customerData.userRole;
    const name = customerData.fullName
    const email = customerData.email

    // Define the routes for Tenant and Customer pages
    const tenantRoute = "/tenant";
    const customerRoute = "/customer";

    // Redirect based on user role
    if (userRole === "Tenant") {
      navigate(tenantRoute);
      navigate(tenantRoute, { name, email, userRole });
    } else if (userRole === "customer") {
      navigate(customerRoute, { name, email, userRole });
    } else {
      // Handle other roles as needed
      window.alert("Unknown user role. Redirecting to the default page.");
      navigate("/");
    }
  };

  render() {
    const { isButtonDisabled } = this.state;
    return (
      <div className="login-container">
        <div className="login-form">
          <form>
            <h1>Login</h1>
            <div className="content">
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="nope"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
              </div>
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </div>
            </div>
            <div className="action">
              <button
                onClick={this.onLogin}
                disabled={isButtonDisabled}
                type="submit"
                className="signin-button"
              >
                SignIn
              </button>
              <button
                onClick={this.onSubmit}
                type="submit"
                className="signin-button"
              >
                Register
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
        <div className="drive-easy-container">
            <h1 className="drive-easy-heading">DriveEasy</h1>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPage);



