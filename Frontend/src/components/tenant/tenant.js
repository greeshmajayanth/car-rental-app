import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../withRouter";
import "../../App.css";

class TenantPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfileWindow: false,
            // ...props.location.state,
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
        const { showProfileWindow, name, email, userRole } = this.state;
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
                        <div>
                            <Link to="/tenant/customers">
                                <button>Customers</button>
                            </Link>
                            <Link to="/tenant/owners">
                                <button>Owners</button>
                            </Link>
                            <Link to="/tenant/cars">
                                <button>Cars</button>
                            </Link>
                            <Link to="/tenant/rental">
                                <button>Rental</button>
                            </Link>
                        </div>
                    </div>
                    <br></br>
                    {/* Add Card Section */}
                    <div className="add-card">
                        <h2>Add Card</h2>
                        <div>
                            <Link to="/tenant/add-vehicle">
                                <button>Add Vehicle</button>
                            </Link>
                        </div>
                    </div>
                </div>
                {showProfileWindow && (
                    <div className="profile-window">
                        {/* Display user profile information */}
                        <p>Full Name: {name}</p>
                        <p>Email: {email}</p>
                        <p>User Role: {userRole}</p>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(TenantPage);
