import React, { Component } from "react";
import withRouter from "../../withRouter";
import "../../App.css";

class AddCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [
                {
                    customer_id: "1",
                    f_initial: "O",
                    LName: "Tagore",
                    phone: "654-212-9381",
                },
                {
                    customer_id: "2",
                    f_initial: "A",
                    LName: "Smith",
                    phone: "789-456-1230",
                },
                // Add more customer data objects as needed
            ],
            customer_id: "",
            f_initial: "",
            LName: "",
            phone: "",
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const newCustomer = {
            customer_id: this.state.customers.length + 1,
            f_initial: this.state.f_initial,
            LName: this.state.LName,
            phone: this.state.phone,
        };
        this.setState((prevState) => ({
            customers: [...prevState.customers, newCustomer],
            f_initial: "",
            LName: "",
            phone: "",
        }));
    };

    toggleProfileWindow = () => {
        this.setState((prevState) => ({
            showProfileWindow: !prevState.showProfileWindow,
        }));
    };

    handleLogout = () => {
        const { navigate } = this.props;
        navigate("/");
    };

    render() {
        return (
            <div>
                <div className="header">
                    <div className="profile" onClick={this.toggleProfileWindow}>
                        {/* Add profile icon or user details here */}
                        <span className="profile-icon">👤</span>
                    </div>
                    <button className="logout-button" onClick={this.handleLogout}>
                        Logout
                    </button>
                </div>
                <div className="add-vehicle-container">
                    <div className="add-vehicle-form-container">
                        <h2>Add Customer</h2>
                        <form className="add-vehicle-form" onSubmit={this.handleSubmit}>
                            <label>First Initial:</label>
                            <input
                                type="text"
                                name="f_initial"
                                value={this.state.f_initial}
                                onChange={this.handleInputChange}
                                placeholder="Enter first initial"
                                required
                            />
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="LName"
                                value={this.state.LName}
                                onChange={this.handleInputChange}
                                placeholder="Enter last name"
                                required
                            />
                            <label>Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={this.state.phone}
                                onChange={this.handleInputChange}
                                placeholder="Enter phone number"
                                required
                            />
                            <button type="submit">Add Customer</button>
                        </form>
                    </div>
                    <div className="dashboard-container">
                        <h2>Customer Dashboard</h2>
                        <div className="vehicle-list">
                            {this.state.customers.map((customer, index) => (
                                <div key={index} className="vehicle-card">
                                    <h3>{`${customer.f_initial} ${customer.LName}`}</h3>
                                    <p>Customer ID: {customer.customer_id}</p>
                                    <p>Phone: {customer.phone}</p>
                                </div>
                            ))}
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
            </div>
        );
    }
}

export default withRouter(AddCustomer);
