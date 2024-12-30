from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def tv_interface():
    return render_template('index.html')

@app.route('/remote')
def remote_interface():
    return render_template('remote2.html')

@socketio.on('remote_command')
def handle_remote_command(data):
    # Forward the command to all connected clients
    emit('command', data, broadcast=True)
    print("Received command: " + str(data))

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)
