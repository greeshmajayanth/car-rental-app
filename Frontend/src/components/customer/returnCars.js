import React, { Component } from 'react';
import withRouter from '../../withRouter';
import axios from 'axios';
import '../../App.css';

class ReturnCars extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfileWindow: false,
            showReturnModal: false,
            selectedCarType: null,
            rentedCars: {},
            selectedCarType: null,
            selectedVehicleId: null,
            selectedRentedCar: null,
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleReturnCar = this.handleReturnCar.bind(this);
        this.handleMakeReturn = this.handleMakeReturn.bind(this);
        this.handleCancelReturn = this.handleCancelReturn.bind(this);
    }

    componentDidMount() {
        // Fetch rented cars data from the /getreturncars API
        axios.get('http://localhost:3001/getreturncars')
            .then(response => {
                console.log(response)
                this.setState({ rentedCars: response.data });
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

    handleReturnCar = (selectedCarData) => {

        // Extract relevant data from the selected car
        const selectedCarType = selectedCarData['Car Type'];
        const selectedVehicleId = selectedCarData['Vehicle Id'];

        // Set the selected car data in the component state
        this.setState({
            selectedCarType,
            selectedVehicleId,
            showReturnModal: true,  // Show the payment modal after selecting a car
        });
    }

    handleCarTypeChange = (carType) => {
        this.setState({ selectedCarType: carType });
    };

    handleMakeReturn = () => {

        // Extract the information of the selected car for return
        const { selectedCarType, selectedVehicleId } = this.state;

        // Make a request to the return car API
        axios.post(`http://localhost:3001/return/${selectedCarType}/${selectedVehicleId}`)
            .then(response => {
                // Handle the successful return
                window.alert('Car returned successfully');
                console.log(response)
                this.props.navigate('/customer')
                // Update the state or fetch the updated rented cars data
                // Reset the modal state
                this.setState({
                    showReturnModal: false,
                    selectedCarType: null,
                    selectedVehicleId: null
                });
            })
            .catch(error => {
                // Handle the error
                console.error('Error returning car:', error);
            });
    }

    handleCancelReturn = () => {
        this.setState({
            showReturnModal: false,
            selectedRentedCar: null,
        });
    };

    render() {
        const { selectedCarType, rentedCars } = this.state;
        const selectedCarList = rentedCars[selectedCarType] || [];
       
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
                    <h2>Rented - {selectedCarType} Cars</h2>
                    <div className="car-type-buttons">
                        <button onClick={() => this.handleCarTypeChange('Compact')}>Compact Cars</button>
                        <button onClick={() => this.handleCarTypeChange('Medium')}>Medium Cars</button>
                        <button onClick={() => this.handleCarTypeChange('SUV')}>SUV Cars</button>
                    </div>
                    {selectedCarList.map((rentedCar, index) => (
                        <div key={index} className="owner-car">
                            <div className="details-row">
                                <p>
                                    <strong>Vehicle ID:</strong> {rentedCar['Vehicle ID']}
                                </p>
                                <p>
                                    <strong>Car Type:</strong> {rentedCar['Car Type']}
                                </p>
                                <p>
                                    <strong>Model:</strong> {rentedCar['Model']}
                                </p>
                                <p>
                                    <strong>Year:</strong> {rentedCar['Year']}
                                </p>
                                <button className="book-button" onClick={() => this.handleReturnCar(rentedCar)}>
                                    Return
                                </button>
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
                    {this.state.showReturnModal && (
                        <div>
                            <div className="overlay" ></div>
                            <div className="payment-modal">
                                <div className="payment-modal-content">
                                    <h2>Return Car</h2>
                                    <p>Are you sure you want to return this car?</p>
                                    <p>Amount due: $100.00</p>
                                    <button className="payment-button" onClick={this.handleMakeReturn}>
                                        Pay and Return
                                    </button>
                                    <button className="payment-button" onClick={this.handleCancelReturn}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(ReturnCars);
