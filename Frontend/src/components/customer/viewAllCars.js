import React, { Component } from 'react';
import withRouter from '../../withRouter';
import axios from 'axios';
import '../../App.css';

class ViewAllCars extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfileWindow: false,
            selectedCarType: 'Compact',
            showPaymentModal: false,
            selectedCarType: null,
            selectedVehicleId: null,
            carData: {}
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleMakePayment = this.handleMakePayment.bind(this);
    }

    componentDidMount() {
        // Fetch rented cars data from the /getreturncars API
        axios.get('http://localhost:3001/getcars')
            .then(response => {
                console.log(response)
                this.setState({ carData: response.data });
            })
            .catch(error => {
                console.error('Error fetching rented cars:', error);
            });
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

    handleCarTypeChange = (carType) => {
        this.setState({ selectedCarType: carType });
    };

    handleBookCar = (selectedCarData) => {
        // Extract relevant data from the selected car
        const selectedCarType = selectedCarData['Car Type'];
        const selectedVehicleId = selectedCarData['Vehicle Id'];

        // Set the selected car data in the component state
        this.setState({
            selectedCarType,
            selectedVehicleId,
            showPaymentModal: true,  // Show the payment modal after selecting a car
        });
    }

    handleMakePayment = () => {
        const { selectedCarType, selectedVehicleId } = this.state;

        // Make a request to the book car API
        axios.post(`http://localhost:3001/book/${selectedCarType}/${selectedVehicleId}`)
            .then(response => {
                // Handle the successful booking
                window.alert('Car booked successfully:', response.data);

                // Update the state or fetch the updated rented cars data
                // Reset the modal state or navigate to a confirmation page
                this.setState({
                    showPaymentModal: false,
                    selectedCarType: null,
                    selectedVehicleId: null
                });
            })
            .catch(error => {
                // Handle the error
                console.error('Error booking car:', error);
            });
    }


    handleCancelPayment = () => {
        this.setState({
            showPaymentModal: false,
        });
    };

    render() {
        const { selectedCarType, carData } = this.state;
        const selectedCarList = carData[selectedCarType] || [];

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
                <div className="owner-details">
                    <h2>Car Details - {selectedCarType} Cars</h2>
                    <div className="car-type-buttons">
                        <button onClick={() => this.handleCarTypeChange('Compact')}>Compact Cars</button>
                        <button onClick={() => this.handleCarTypeChange('Medium')}>Medium Cars</button>
                        <button onClick={() => this.handleCarTypeChange('SUV')}>SUV Cars</button>
                    </div>
                    {selectedCarList.map((carData, index) => (
                        <div key={index} className="owner-card">
                            <div className="details-row">
                                <p>
                                    <strong>Vehicle ID:</strong> {carData['Vehicle Id']}
                                </p>
                                <p>
                                    <strong>Available Period:</strong> {carData['Available period']}
                                </p>
                                <p>
                                    <strong>Car Type:</strong> {carData['Car Type']}
                                </p>
                                <p>
                                    <strong>Model:</strong> {carData['Model']}
                                </p>
                                <p>
                                    <strong>Year:</strong> {carData['Year']}
                                </p>
                                <div className="button-container">
                                    <button className="book-button" onClick={() => this.handleBookCar(carData)}>
                                        Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {this.state.showProfileWindow && (
                        <div className="profile-window">
                            {/* Display user profile information */}
                            <p>Full Name: John Doe</p>
                            <p>Email: john.doe@example.com</p>
                            <p>Phone Number: 123-456-7890</p>
                        </div>
                    )}
                    {this.state.showPaymentModal && (
                        <div>
                            <div className="overlay" ></div>
                            <div className="payment-modal">
                                <div className="payment-modal-content">
                                    <h2>Payment</h2>
                                    <p>Advance Amount to be paid: $500.00</p>
                                    <button className="payment-button" onClick={this.handleMakePayment}>Make Payment</button>
                                    <button className="payment-button" onClick={this.handleCancelPayment}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(ViewAllCars);
