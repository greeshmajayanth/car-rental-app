import React, { Component } from 'react';
import axios from 'axios';
import withRouter from '../../withRouter';
import '../../App.css';

class ViewCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customerDataList: [],
            showProfileWindow: false,
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // Fetch customer data from the server when the component mounts
        this.fetchCustomerData();
    }

    fetchCustomerData() {
        const apiUrl = 'http://localhost:5000/view/getcustomers';
        axios.get(apiUrl)
            .then(response => {
                const customerDataList = response.data.Data;
                console.log(customerDataList)
                this.setState({ customerDataList });
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    }

    toggleProfileWindow() {
        this.setState((prevState) => ({
            showProfileWindow: !prevState.showProfileWindow,
        }));
    }

    handleLogout = () => {
        const { navigate } = this.props;
        navigate('/');
    };

    render() {
        const { customerDataList, showProfileWindow } = this.state;

        return (
            <div>
                <div className="header">
                    <div className="profile" onClick={this.toggleProfileWindow}>
                        <span className="profile-icon">👤</span>
                    </div>
                    <button className="logout-button" onClick={this.handleLogout}>
                        Logout
                    </button>
                </div>
                <div className="owner-details">
                    <h2>Customer Details</h2>
                    {Array.isArray(customerDataList) && customerDataList.length > 0 ? (
                        customerDataList.map((customer, index) => (
                            <div key={index} className="customer-card">
                                <div className="details-row">
                                    <p>
                                        <strong>Customer ID:</strong> {customer["Customer Id"]}
                                    </p>
                                    <p>
                                        <strong>Name:</strong> {customer["First initial"]} {customer["Last name"]}
                                    </p>
                                    <p>
                                        <strong>Phone Number:</strong> {customer["Phone number"]}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No customer data available.</p>
                    )}
                    {showProfileWindow && (
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

export default withRouter(ViewCustomer);
