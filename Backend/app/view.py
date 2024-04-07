from flask import jsonify, Blueprint
from app.config import oracle_config
import cx_Oracle

view_bp = Blueprint('view', __name__)
dsn = cx_Oracle.makedsn(oracle_config['hostname'], oracle_config['port'], service_name=oracle_config['service_name'])

# Endpoint to get compact cars
@view_bp.route('/getallcars')
def get_all_cars():
    
    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT vehicle_id, avail_period, car_type, model, year FROM Car")
        rows = cursor.fetchall()
        result = format_cars(rows, "Cars")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get compact cars
@view_bp.route('/getcompactcars')
def get_compact_cars():
    
    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT vehicle_id, avail_period, car_type, model, year FROM Car WHERE car_type = 'Compact'")
        rows = cursor.fetchall()
        result = format_cars(rows, "Compact Cars")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get medium cars
@view_bp.route('/getmediumcars')
def get_medium_cars():
    
    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        cursor.execute("SELECT vehicle_id, avail_period, car_type, model, year FROM Car WHERE car_type = 'Medium'")
        rows = cursor.fetchall()
        result = format_cars(rows, "Medium Cars")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get SUV cars
@view_bp.route('/getsuv')
def get_suv_cars():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        cursor.execute("SELECT vehicle_id, avail_period, car_type, model, year FROM Car WHERE car_type = 'SUV'")
        rows = cursor.fetchall()
        result = format_cars(rows, "SUV Cars")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get scheduled rentals
@view_bp.route('/getscheduledrentals')
def get_scheduled_rentals():
     
    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        cursor.execute("""SELECT r.transactionId, r.amount_due, c.f_initial, c.LName, a.vehicle_id, a.car_type 
                          FROM Rental r 
                          JOIN Customer c ON r.customer_Id = c.Id_no
                          JOIN Car a ON r.car_Id = a.vehicle_id
                          WHERE r.scheduled = 'T' """)
        rows = cursor.fetchall()
        result = format_rentals(rows, "Scheduled Rentals")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get active rentals
@view_bp.route('/getactiverentals')
def get_active_rentals():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        cursor.execute("""SELECT r.transactionId, r.amount_due, c.f_initial, c.LName, a.vehicle_id, a.car_type 
                          FROM Rental r 
                          JOIN Customer c ON r.customer_Id = c.Id_no
                          JOIN Car a ON r.car_Id = a.vehicle_id
                          WHERE r.scheduled = 'F' """)
        rows = cursor.fetchall()
        result = format_rentals(rows, "Active Rentals")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get customers
@view_bp.route('/getcustomers')
def get_customers():

    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM Customer")
        rows = cursor.fetchall()
        result = format_customers(rows, "Customers")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()

# Endpoint to get owners
@view_bp.route('/getowners')
def get_owners():
    
    # Establish the connection
    conn = cx_Oracle.connect(oracle_config['username'], oracle_config['password'], dsn)

    cursor = conn.cursor()

    try:
        cursor.execute("""SELECT o.owner_id, o.owner_type, o.name, o.phone, o.address, c.vehicle_id, c.car_type, c.model 
                       FROM Car c
                       JOIN Owner o ON c.owner_Id = o.owner_id""")
        rows = cursor.fetchall()
        result = format_owners(rows, "Owners")
        return jsonify(result)
    finally:
        cursor.close()
        conn.close()


def format_cars(cars, car_type):
    headers = ["Vehicle Id", "Available period", "Car Type", "Model", "Year"]
    rows = [dict(zip(headers, car)) for car in cars]
    result = {"Car Type": car_type, "Data": rows}
    return result

def format_rentals(rentals, rental_type):
    headers = ["Transaction Id", "Amount Due", "Customer first initial", "Customer last name", "Vehicle Id", "Car type"]
    rows = [dict(zip(headers, rental)) for rental in rentals]
    result = {"Rental Type": rental_type, "Data": rows}
    return result

def format_customers(customers, customer_type):
    headers = ["Customer Id", "First initial", "Last name", "Phone number"]
    rows = [dict(zip(headers, customer)) for customer in customers]
    result = {"Customer Type": customer_type, "Data": rows}
    return result

def format_owners(owners, owner_type):
    headers = ["Owner Id", "Type", "Name", "Phone number", "Address", "Vehicle Id", "Car type", "Car model"]
    rows = [dict(zip(headers, owner)) for owner in owners]
    result = {"Owner Type": owner_type, "Data": rows}
    return result
