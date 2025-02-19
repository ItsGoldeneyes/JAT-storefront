from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

# Database connection
conn = psycopg2.connect(
    dbname="railway",
    user="postgres",
    password="akwwmxIlIPaRazzCpFjMmnyDiiDAisTe",
    host="caboose.proxy.rlwy.net",
    port="12261"
)
cursor = conn.cursor()

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
            return jsonify({"success": True})
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
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error signing up: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route('/update_user', methods=['POST'])
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
        print(f"Error updating user: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
