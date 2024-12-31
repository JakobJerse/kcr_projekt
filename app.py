from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recents')
def recents():
    return render_template('recents.html')

@app.route('/favourites')
def favourites():
    return render_template('favourites.html')

@app.route('/remote')
def remote():
    return render_template('remote2.html')

@app.route('/landing')
def landing():
    return render_template('landing.html')

@socketio.on('remote_command')
def handle_remote_command(data):
    # Forward the command to all connected clients
    emit('command', data, broadcast=True)
    print("Received command: " + str(data))

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)
