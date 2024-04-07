import React, { Component } from 'react';
import withRouter from "../../withRouter";
import '../../App.css';

class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };

        this.onSubmit = this.onSubmit.bind(this)
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    };

    onSubmit() {
        const { navigate } = this.props;
        navigate("/");
    }

    render() {
        return (
            <div className="login-form">
                <form onSubmit={this.handleSubmit}>
                    <h1>Reset</h1>
                    <h4>Enter your email address associated with your account and we will send you a link to reset your password</h4>
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
                        <a href="#" className="link"></a>
                    </div>
                    <div className="action">
                        <button onClick={this.onSubmit} type="submit" className="submit-button">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(ResetPasswordForm);
