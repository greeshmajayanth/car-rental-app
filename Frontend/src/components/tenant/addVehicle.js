import React, { Component } from "react";
import axios from 'axios';
import withRouter from "../../withRouter";
import "../../App.css";

class AddVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: [],
            vehicle_id: "",
            avail_period: "",
            car_type: "",
            model: "",
            year: "",
            ownerName: "",
            ownerType: "",
            ownerPhone: "",
            ownerAddress: "",
            showProfileWindow: false,
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // Fetch vehicles data from the API when the component mounts
        this.fetchVehicleData();
    }

    fetchVehicleData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/view/getallcars');
            const vehicleData = response.data.Data;

            this.setState({
                vehicles: vehicleData,
            });
        } catch (error) {
            console.error('Error fetching vehicle data:', error.response ? error.response.data : error.message);
        }
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const newVehicle = {
            vehicle_id: this.state.vehicle_id,
            avail_period: this.state.avail_period,
            car_type: this.state.car_type,
            model: this.state.model,
            year: this.state.year,
            ownerName: this.state.ownerName,
            ownerType: this.state.ownerType,
            ownerPhone: this.state.ownerPhone,
            ownerAddress: this.state.ownerAddress,
        };

        try {
            // Make API call to add a new car
            const response = await axios.post('http://localhost:5000/create/addcar', newVehicle);

            // Update state with the new vehicle added
            this.setState((prevState) => ({
                vehicles: [...prevState.vehicles, newVehicle],
                vehicle_id: "",
                avail_period: "",
                car_type: "",
                model: "",
                year: "",
                ownerName: "",
                ownerType: "",
                ownerPhone: "",
                ownerAddress: "",
            }));

            console.log(response.data.message);
        } catch (error) {
            console.error('Error adding vehicle:', error.response ? error.response.data : error.message);
        }
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
                        <h2>Add Vehicle</h2>
                        <form className="add-vehicle-form" onSubmit={this.handleSubmit}>
                            <label>Vehicle Number:</label>
                            <input
                                type="text"
                                name="vehicle_id"
                                value={this.state.vehicle_id}
                                onChange={this.handleInputChange}
                                placeholder="Enter last four digits"
                                required
                            />
                            <label>Availability Period:</label>
                            <input
                                type="text"
                                name="avail_period"
                                value={this.state.avail_period}
                                onChange={this.handleInputChange}
                                placeholder="E.g., 2023-05-04 to 2023-05-30"
                                required
                            />
                            <label>Car Type:</label>
                            <input
                                type="text"
                                name="car_type"
                                value={this.state.car_type}
                                onChange={this.handleInputChange}
                                placeholder="Enter car type"
                                required
                            />
                            <label>Model:</label>
                            <input
                                type="text"
                                name="model"
                                value={this.state.model}
                                onChange={this.handleInputChange}
                                placeholder="Enter car model"
                                required
                            />
                            <label>Year:</label>
                            <input
                                type="text"
                                name="year"
                                value={this.state.year}
                                onChange={this.handleInputChange}
                                placeholder="Enter car year"
                                required
                            />
                            <label>Owner Name:</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={this.state.ownerName}
                                onChange={this.handleInputChange}
                                placeholder="Enter owner name"
                                required
                            />
                            <label>Owner Type:</label>
                            <input
                                type="text"
                                name="ownerType"
                                value={this.state.ownerType}
                                onChange={this.handleInputChange}
                                placeholder="Enter owner type"
                                required
                            />
                            <label>Owner Phone:</label>
                            <input
                                type="text"
                                name="ownerPhone"
                                value={this.state.ownerPhone}
                                onChange={this.handleInputChange}
                                placeholder="Enter owner phone"
                                required
                            />
                            <label>Owner Address:</label>
                            <input
                                type="text"
                                name="ownerAddress"
                                value={this.state.ownerAddress}
                                onChange={this.handleInputChange}
                                placeholder="Enter owner address"
                                required
                            />
                            <button type="submit">Add Vehicle</button>
                        </form>
                    </div>
                    <div className="dashboard-container">
                        <h2>Vehicle Dashboard</h2>
                        <div className="vehicle-list">
                            {this.state.vehicles.map((vehicle, index) => (
                                <div key={index} className="vehicle-card">
                                    <h3>{vehicle.model}</h3>
                                    <p>Vehicle ID: {vehicle['Vehicle Id']}</p>
                                    <p>Type: {vehicle['Car Type']}</p>
                                    <p>Year: {vehicle['Year']}</p>
                                    <p>Model: {vehicle['Model']}</p>
                                    <p>Available Period: {vehicle['Available period']}</p>
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

export default withRouter(AddVehicle);
