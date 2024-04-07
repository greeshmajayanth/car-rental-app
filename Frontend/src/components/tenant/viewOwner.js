import React, { Component } from 'react';
import axios from 'axios';
import withRouter from '../../withRouter';
import '../../App.css';

class ViewOwner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ownerDataList: [],
            showProfileWindow: false,
        };

        // Binding functions to the class instance
        this.toggleProfileWindow = this.toggleProfileWindow.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // Fetch owner data from the server when the component mounts
        this.fetchOwnerData();
    }

    fetchOwnerData() {
        const apiUrl = 'http://localhost:5000/view/getowners';
        axios.get(apiUrl)
            .then(response => {
                const ownerDataList = response.data.Data;
                console.log(ownerDataList);
                this.setState({ ownerDataList });
            })
            .catch(error => {
                console.error('Error fetching owner data:', error);
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
        const { ownerDataList, showProfileWindow } = this.state;

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
                    <h2>Owner Details</h2>
                    {Array.isArray(ownerDataList) && ownerDataList.length > 0 ? (
                        ownerDataList.map((owner, index) => (
                            <div key={index} className="owner-card">
                                <div className="details-row">
                                    <p>
                                        <strong>Owner ID:</strong> {owner["Owner Id"]}
                                    </p>
                                    <p>
                                        <strong>Name:</strong> {owner["Name"]}
                                    </p>
                                    <p>
                                        <strong>Phone Number:</strong> {owner["Phone number"]}
                                    </p>
                                    <p>
                                        <strong>Address:</strong> {owner["Address"]}
                                    </p>
                                    <p>
                                        <strong>Car Model:</strong> {owner["Car model"]}
                                    </p>
                                    <p>
                                        <strong>Car Type:</strong> {owner["Car type"]}
                                    </p>
                                    <p>
                                        <strong>Vehicle ID:</strong> {owner["Vehicle Id"]}
                                    </p>
                                    <p>
                                        <strong>Type:</strong> {owner["Type"]}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No owner data available.</p>
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

export default withRouter(ViewOwner);
