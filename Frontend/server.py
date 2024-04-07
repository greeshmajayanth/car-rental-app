from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Get the absolute path to the directory containing the script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Join the script directory with the file name
filePath = os.path.join(script_dir, 'cars.json')

# Load available cars from the JSON file
with open(filePath, 'r') as file:
    available_cars = json.load(file)

# Create an empty rented_cars JSON
rented_cars = {}

file_path = 'loginData.json'

def write_to_file(data):
    try:
        file_exists = os.path.isfile(file_path)

        with open(file_path, 'r+' if file_exists else 'w') as file:
            # Load existing data if the file exists, or initialize as an empty list
            existing_data = json.load(file) if file_exists else []

            # Add the new data to the list
            existing_data.append(data)

            # Write the updated list back to the file
            file.seek(0)
            json.dump(existing_data, file, indent=2)
            file.truncate()

        return None  # No error
    except Exception as e:
        return str(e)  # Return the error message

@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        data = request.get_json()
        error = write_to_file(data)

        if error:
            raise Exception(error)

        return 'Form data submitted successfully!'
    except Exception as e:
        return f'Error submitting form: {str(e)}', 500

def get_users():
    try:
        with open(file_path, 'r') as file:
            users = json.load(file)
        return users
    except FileNotFoundError:
        return []  # Return an empty list if the file is not found
    except Exception as e:
        raise e

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        users = get_users()
        user = next((u for u in users if u['email'] == email and u['password'] == password), None)

        if user:
            # Successful login
            full_name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
            return jsonify({'email': email, 'fullName': full_name, 'userRole': user['userRole']})
        else:
            # Failed login
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/getcars', methods=['GET'])
def get_available_cars():
    return jsonify(available_cars)

@app.route('/book/<car_type>/<int:vehicle_id>', methods=['POST'])
def book_car(car_type, vehicle_id):
    if car_type in available_cars and any(car['Vehicle Id'] == vehicle_id for car in available_cars[car_type]):
        car_to_book = next(car for car in available_cars[car_type] if car['Vehicle Id'] == vehicle_id)

        # Remove the booked car from available_cars
        available_cars[car_type].remove(car_to_book)

        # Add the booked car to rented_cars
        if car_type not in rented_cars:
            rented_cars[car_type] = []
        rented_cars[car_type].append(car_to_book)

        # Save the changes to the JSON files
        with open('cars.json', 'w') as file:
            json.dump(available_cars, file, indent=2)

        return jsonify({"result": "success", "message": f"Car {vehicle_id} booked successfully"}), 200
    else:
        return jsonify({"result": "failure", "message": "Car not available or does not exist"}), 404

@app.route('/getreturncars', methods=['GET'])
def get_return_cars():
    return jsonify(rented_cars)

@app.route('/return/<car_type>/<int:vehicle_id>', methods=['POST'])
def return_car(car_type, vehicle_id):
    if car_type in rented_cars and any(car['Vehicle Id'] == vehicle_id for car in rented_cars[car_type]):
        car_to_return = next(car for car in rented_cars[car_type] if car['Vehicle Id'] == vehicle_id)

        # Remove the returned car from rented_cars
        rented_cars[car_type].remove(car_to_return)

        # Add the returned car back to available_cars
        available_cars[car_type].append(car_to_return)

        # Save the changes to the JSON files
        with open('cars.json', 'w') as file:
            json.dump(available_cars, file, indent=2)

        return jsonify({"result": "success", "message": f"Car {vehicle_id} returned successfully"}), 200
    else:
        return jsonify({"result": "failure", "message": "Car not rented or does not exist"}), 404

if __name__ == '__main__':
    app.run(debug=True)



if __name__ == '__main__':
    app.run(port=3001)
