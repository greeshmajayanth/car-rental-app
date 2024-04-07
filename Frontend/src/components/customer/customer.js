import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../withRouter";
import "../../App.css";

class CustomerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfileWindow: false,
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleProfileWindow() {
        this.setState((prevState) => ({
            showProfileWindow: !prevState.showProfileWindow,
        }));
    }

    handleLogout = () => {
        const { navigate } = this.props;
        navigate("/");
    };

    render() {
        return (
            <div className="container-card">
                <div className="header">
                    <div className="profile" onClick={this.toggleProfileWindow}>
                        {/* Add profile icon or user details here */}
                        <span className="profile-icon">👤</span>
                    </div>
                    <button className="logout-button" onClick={this.handleLogout}>
                        Logout
                    </button>
                </div>
                <div className="container">
                    <br></br>
                    {/* View Card Section */}
                    <div className="view-card">
                        <h2>View Card</h2>
                        <br></br>
                        <div>
                            <Link to="/customer/view-all-cars">
                                <button>View All Cars</button>
                            </Link>
                            <Link to="/customer/return-cars">
                                <button>Return Cars</button>
                            </Link>
                        </div>
                    </div>
                </div>
                {this.state.showProfileWindow && (
                    <div className="profile-window">
                        {/* Display user profile information */}
                        <p>Full Name: John Doe</p>
                        <p>Email: john.doe@example.com</p>
                        <p>Phone Number: 123-456-7890</p>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(CustomerPage);
