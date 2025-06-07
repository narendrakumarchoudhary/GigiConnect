from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_cors import CORS
from datetime import timedelta
from config import Config
from models import User, db, Worker  # ⬅️ import db here

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'gigconnect-secret-key'
app.permanent_session_lifetime = timedelta(days=1)
CORS(app)

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    db.create_all()

# In-memory mock database
users = []
jobs = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/browse')
def browse():
    return render_template('browse.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        category = request.form.get('category')
        rate = request.form.get('rate')
        location = request.form.get('location')
        rating = request.form.get('rating')

        # Check if a user already exists with the same email
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return render_template('register.html', success_message="User already exists!")

        # Create new user
        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.flush()  # Gets new_user.id without committing yet

        # Optional: Check if the same worker (category + location) already exists for this user
        existing_worker = Worker.query.filter_by(
            user_id=new_user.id,
            category=category,
            location=location
        ).first()
        if existing_worker:
            return render_template('register.html', success_message="Worker already registered!")

        # Create new worker profile
        new_worker = Worker(
            category=category,
            rate=float(rate),
            location=location,
            rating=float(rating),
            user_id=new_user.id
        )

        db.session.add(new_worker)
        db.session.commit()

        return render_template('register.html', success_message="Worker registered successfully!")

    return render_template('register.html')



@app.route('/post-job')
def post_job():
    return render_template('post-job.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['user_id'] = user.id
            return redirect(url_for('dashboard'))
        else:
            return "Invalid credentials"

    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', user=session['user'])

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    email = data.get('email')
    if any(u['email'] == email for u in users):
        return jsonify({'message': 'Email already exists'}), 400

    users.append(data)
    return jsonify({'message': 'Registration successful'})

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    for user in users:
        if user['email'] == email and user['password'] == password and user['role'] == role:
            session.permanent = True
            session['user'] = user
            return jsonify({'message': 'Login successful'})

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out'})

@app.route('/api/post-job', methods=['POST'])
def api_post_job():
    if 'user' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    data = request.get_json()
    data['posted_by'] = session['user']['email']
    jobs.append(data)
    return jsonify({'message': 'Job posted successfully'})

@app.route('/api/dashboard')
def api_dashboard():
    if 'user' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    user = session['user']
    if user['role'] == 'customer':
        user_jobs = [job for job in jobs if job['posted_by'] == user['email']]
        return jsonify({'jobs': user_jobs})
    elif user['role'] == 'worker':
        return jsonify({'profile': user})
    return jsonify({'message': 'Unknown role'})

if __name__ == '__main__':
    app.run(debug=True)
