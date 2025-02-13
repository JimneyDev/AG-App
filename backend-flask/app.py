from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from database import db  # Ensure db is correctly imported from database.py
from models import User  # Enssqlite3 database.db\
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)  # Allow requests from all origins

# Database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///C:/Users/jonat/CubeGames_App/ag-app/backend-flask/instance/users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "super-secret-key"

# Initialize Bcrypt, and JWT
bcrypt = Bcrypt()
jwt = JWTManager()

# Initialize extensions with the app
db.init_app(app)
migrate = Migrate(app, db)
bcrypt.init_app(app)
jwt.init_app(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the API!"})

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")  # Changed email to username
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()  # Changed email to username
    if user:
        return jsonify({"message": "User already exists"}), 409

    new_user = User(username=username, password=password)  # Changed email to username
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    # Retrieve user by username (was email previously)
    user = User.query.filter_by(username=data["username"]).first()  # Changed email to username

    # If user doesn't exist or password doesn't match
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=user.id)

    # Return success message with the token and user info (username here)
    return jsonify({
        "message": "Login successful!",
        "token": access_token,
        "user": {"username": user.username}  # Changed email to username
    })

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/users', methods=['GET'])
def get_users():
    # Retrieve all users from the database
    users = User.query.all()  # Query to get all User records

    # Prepare the data to be returned
    user_data = [{'username': user.username, 'password': user.password} for user in users]  # Changed email to username
    
    return jsonify(user_data)

@app.route('/delete_user', methods=['DELETE'])
def delete_user():
    data = request.get_json()
    username = data.get('username')  # Changed email to username
    user = User.query.filter_by(username=username).first()  # Changed email to username

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"message": "User not found"}), 404

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
