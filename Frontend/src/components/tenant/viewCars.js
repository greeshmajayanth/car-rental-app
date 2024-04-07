import React, { Component } from 'react';
import axios from 'axios';
import withRouter from '../../withRouter';
import '../../App.css';

class ViewCars extends Component {
    constructor(props) {
        super(props);

        this.state = {
            carDataList: [],
            showProfileWindow: false,
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // Fetch car data from the server when the component mounts
        this.fetchCarData();
    }

    fetchCarData() {
        const apiUrl = 'http://localhost:5000/view/getallcars';
        axios.get(apiUrl)
            .then(response => {
                const carDataList = response.data.Data;
                console.log(carDataList);
                this.setState({ carDataList });
            })
            .catch(error => {
                console.error('Error fetching car data:', error);
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
        const { carDataList, showProfileWindow } = this.state;

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
                    <h2>Car Details</h2>
                    {Array.isArray(carDataList) && carDataList.length > 0 ? (
                        carDataList.map((carData, index) => (
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
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No car data available.</p>
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

export default withRouter(ViewCars);
