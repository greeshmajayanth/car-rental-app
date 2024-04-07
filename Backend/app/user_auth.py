from flask import request, jsonify, Blueprint
import json

import os

# Get the absolute path to the directory containing the script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Join the script directory with the file name
file_path = os.path.join(script_dir, 'users.json')

# Load users from the JSON file
with open(file_path) as f:
    users = json.load(f)

def write_users(users):
    with open(file_path, 'w') as f:
        json.dump(users, f, indent=2)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])  
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # Check if the email is present in the list
        user = next((user for user in users if user['email'] == email), None)

        if user:
            if user['password'] == password:
                return jsonify({"result": "success"}), 200
            else:
                return jsonify({"result": "Wrong password"}), 401
        else:
            return jsonify({"result": "Email not found. Please register"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        f_initial = data.get('f_initial')
        LName = data.get('LName')
        phone = data.get('phone')
        email = data.get('email')
        password = data.get('password')

        print(type(email))

        # Check if the email is already in use
        if any(user['email'] == email for user in users):
            return jsonify({"result": "You have already registered with this email"}), 409  # Conflict

        # Generate a new user ID (you might want to implement a more robust ID generation)
        new_user_id = len(users) + 1

        # Create a new user
        new_user = {
            "id": new_user_id,
            "f_initial": f_initial,
            "LName": LName,
            "phone": phone,
            "email": email,
            "password": password
        }

        # Append the new user to the list
        users.append(new_user)

        # Write the updated user data back to the file
        write_users(users)

        return jsonify({"result": "Registered successfully"}), 201  # Created

    except Exception as e:
        return jsonify({"error": str(e)}), 500
