from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import psycopg2
import os
import jwt
import datetime

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")

# Database connection
conn = psycopg2.connect(
    dbname="railway",
    user="postgres",
    password="akwwmxIlIPaRazzCpFjMmnyDiiDAisTe",
    host="caboose.proxy.rlwy.net",
    port="12261"
)
cursor = conn.cursor()

def generate_token(email):
    payload = {
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    def decorator(*args, **kwargs):
        token = request.cookies.get('access_token')
        if not token:
            return jsonify({"success": False, "message": "Token is missing"}), 401
        try:
            jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorator

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data['email']
    password = data['password']

    try:
        print(f"Attempting sign-in with email: {email} and password: {password}")
        cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
        user = cursor.fetchone()
        if user:
            token = generate_token(email)
            response = make_response(jsonify({"success": True}))
            response.set_cookie('access_token', token, httponly=True)
            return response
        else:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Error signing in: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']

    try:
        print(f"Attempting sign-up with email: {email} and password: {password}")
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        if user:
            return jsonify({"success": False, "message": "Email already exists"}), 400
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        conn.commit()
        token = generate_token(email)
        response = make_response(jsonify({"success": True}))
        response.set_cookie('access_token', token, httponly=True)
        return response
    except Exception as e:
        print(f"Error signing up: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route('/update_user', methods=['POST'])
@token_required
def update_user():
    data = request.get_json()
    email = data['email']
    name = data.get('name', '')

    try:
        print(f"Attempting to update user with email: {email} and name: {name}")
        cursor.execute("UPDATE users SET name=%s WHERE email=%s", (name, email))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()  # Rollback the transaction in case of error
        print(f"Error updating user: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
