import React, { Component } from 'react';
import axios from 'axios';
import withRouter from '../../withRouter';
import '../../App.css';

class ViewRentals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rentalDataList: [],
            showProfileWindow: false,
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // Fetch rental data from the server when the component mounts
        this.fetchRentalData();
    }

    fetchRentalData() {
        const apiUrl = 'http://localhost:5000/view/getscheduledrentals';
        axios.get(apiUrl)
            .then(response => {
                const rentalDataList = response.data.Data;
                console.log(rentalDataList);
                this.setState({ rentalDataList });
            })
            .catch(error => {
                console.error('Error fetching rental data:', error);
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
        const { rentalDataList, showProfileWindow } = this.state;

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
                    <h2>Rental Details</h2>
                    {Array.isArray(rentalDataList) && rentalDataList.length > 0 ? (
                        rentalDataList.map((rentalData, index) => (
                            <div key={index} className="owner-card">
                                <div className="details-row">
                                    <p>
                                        <strong>Transaction ID:</strong> {rentalData['Transaction Id']}
                                    </p>
                                    <p>
                                        <strong>Amount Due:</strong> {rentalData['Amount Due']}
                                    </p>
                                    <p>
                                        <strong>Car Type:</strong> {rentalData['Car type']}
                                    </p>
                                    <p>
                                        <strong>Customer Name:</strong> {`${rentalData['Customer first initial']} ${rentalData['Customer last name']}`}
                                    </p>
                                    <p>
                                        <strong>Vehicle ID:</strong> {rentalData['Vehicle Id']}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No rental data available.</p>
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

export default withRouter(ViewRentals);
