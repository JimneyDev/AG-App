from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from database import db  # Ensure db is correctly imported from database.py
from models import User  # Ensure User model includes display_name and dark_mode
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)  # Allow requests from all origins

# Database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///C:/Users/jonat/CubeGames_App/ag-app/backend-flask/instance/users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "super-secret-key"

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
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
    username = data.get("username")
    password = data.get("password")
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"message": "User already exists"}), 409

    # Default display_name to username if not provided; dark_mode defaults to False.
    display_name = data.get("display_name", username)
    dark_mode = data.get("dark_mode", False)

    new_user = User(username=username, password=hashed_password, display_name=display_name, dark_mode=dark_mode)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "message": "Login successful!",
        "token": access_token,
        "user": {
            "username": user.username,
            "display_name": user.display_name,
            "dark_mode": user.dark_mode
        }
    })

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = []
    for user in users:
        users_list.append({
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'dark_mode': user.dark_mode
        })
    return jsonify(users_list)

@app.route("/update_settings", methods=["POST"])
def update_settings():
    data = request.get_json()
    username = data.get("username")
    display_name = data.get("displayName")
    dark_mode = data.get("darkMode")

    if not username or display_name is None or dark_mode is None:
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.display_name = display_name
    user.dark_mode = dark_mode
    db.session.commit()

    return jsonify({
        "message": "Settings updated successfully",
        "display_name": user.display_name,
        "dark_mode": user.dark_mode
    }), 200

@app.route("/delete_user", methods=["DELETE"])
def delete_user():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {username} deleted successfully"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
