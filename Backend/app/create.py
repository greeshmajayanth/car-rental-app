from flask import request, jsonify, Blueprint
from app.config import oracle_config
import cx_Oracle

create_bp = Blueprint('create', __name__)
dsn = cx_Oracle.makedsn(oracle_config['hostname'], oracle_config['port'], service_name=oracle_config['service_name'])

# Endpoint to add customer
@create_bp.route('/addcustomer', methods=['POST'])
def add_customer():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()
    try:
        # Get data from the request
        data = request.json
        f_initial = data.get('f_initial')
        LName = data.get('LName')
        phone = data.get('phone')

        # Add new customer to the database
        cursor.execute("SELECT * FROM Customer")
        result = cursor.fetchall()
        count = len(result)
        cursor.execute("INSERT INTO Customer (Id_no, f_initial, LName, phone) VALUES (:1, :2, :3, :4)", (count + 1, f_initial, LName, phone))
        conn.commit()

        return jsonify({"message": "New customer added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Endpoint to add car
@create_bp.route('/addcar', methods=['POST'])
def add_car():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        # Get data from the request
        data = request.json
        vehicle_id = data.get('vehicle_id')
        avail_period = data.get('avail_period')
        car_type = data.get('car_type')
        model = data.get('model')
        year = data.get('year')
        ownerName = data.get('ownerName')
        ownerType = data.get('ownerType')
        ownerPhone = data.get('ownerPhone')
        ownerAddress = data.get('ownerAddress')

        # Add new owner to the database
        cursor.execute("SELECT * FROM Owner")
        result = cursor.fetchall()
        count = len(result)
        cursor.execute("INSERT INTO Owner (owner_id, owner_type, name, phone, address) VALUES (:1, :2, :3, :4, :5)", (count + 11001, ownerType, ownerName, ownerPhone, ownerAddress))

        # Add new car to the database
        cursor.execute("INSERT INTO Car (vehicle_id, avail_period, car_type, model, year, owner_Id) VALUES (:1, :2, :3, :4, :5, :6)", (vehicle_id, avail_period, car_type, model, year, count + 11001))
        conn.commit()

        return jsonify({"message": "New car added successfully"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

# Endpoint to schedule a rental
@create_bp.route('/schedulerental', methods=['POST'])
def schedule_rental():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        # Get data from the request
        data = request.json
        rental_type = data.get('rental_type')
        customer_id = data.get('customer_id')

        if rental_type == 1:
            # Process weekly rental
            weeks = data.get('weeks')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            car_type = data.get('car_type')
            car_id = data.get('car_id')
            transaction_id = data.get('transaction_id')
            amount_due = data.get('amount_due')

            # Insert data into Rental and Weekly_rate tables
            cursor.execute("INSERT INTO Rental (transactionId, scheduled, active, amount_due, customer_Id, car_Id) VALUES (:1, 'T', 'F', :2, :3, :4)",
                           (transaction_id, amount_due/2, customer_id, car_id))
            cursor.execute("INSERT INTO Weekly_rate (week_id, car_type, no_of_weeks, start_date, return_date, total_amount, transaction_Id) VALUES "
                           "((SELECT NVL(MAX(week_id), 0) + 1 FROM Weekly_rate), :1, :2, TO_DATE(:3, 'YYYY-MM-DD'), TO_DATE(:4, 'YYYY-MM-DD'), :5, :6)",
                           (car_type, weeks, start_date, end_date, amount_due, transaction_id))

            conn.commit()
            return jsonify({"message": "Weekly rental scheduled successfully"}), 201

        elif rental_type == 2:
            # Process daily rental
            days = data.get('days')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            car_type = data.get('car_type')
            car_id = data.get('car_id')
            transaction_id = data.get('transaction_id')
            amount_due = data.get('amount_due')

            # Insert data into Rental and Daily_rate tables
            cursor.execute("INSERT INTO Rental (transactionId, scheduled, active, amount_due, customer_Id, car_Id) VALUES (:1, 'T', 'F', :2, :3, :4)",
                           (transaction_id, amount_due / 2, customer_id, car_id))
            cursor.execute("INSERT INTO Daily_rate (day_id, car_type, no_of_days, start_date, return_date, total_amount, transaction_Id) VALUES "
                           "((SELECT NVL(MAX(day_id), 0) + 1 FROM Daily_rate), :1, :2, TO_DATE(:3, 'YYYY-MM-DD'), TO_DATE(:4, 'YYYY-MM-DD'), :5, :6)",
                           (car_type, days, start_date, end_date, amount_due, transaction_id))

            conn.commit()
            return jsonify({"message": "Daily rental scheduled successfully"}), 201

        else:
            return jsonify({"error": "Invalid rental type"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

# Endpoint to return a rental
@create_bp.route('/returnrental', methods=['POST'])
def return_rental():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        # Get data from the request
        data = request.json
        advance_transaction_id = data.get('advance_transaction_id')

        # Retrieve amount_due from the database
        cursor.execute("SELECT amount_due FROM Rental WHERE transactionId = :1", (advance_transaction_id,))
        rows = cursor.fetchall()

        if not rows:
            return jsonify({"error": "Transaction ID not found"}), 404

        amount_due = rows[0][0]

        # Update Rental table to mark the rental as returned
        cursor.execute("UPDATE Rental SET scheduled = 'F', active = 'F', amount_due = 0 WHERE transactionId = :1", (advance_transaction_id,))
        conn.commit()

        return jsonify({"message": f"Car returned successfully. Amount to be paid: {amount_due}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()








