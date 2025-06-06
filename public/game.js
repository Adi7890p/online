const socket = new WebSocket(`wss://${window.location.host}`);
const roomCode = localStorage.getItem('roomCode');

socket.onopen = () => {
  socket.send(JSON.stringify({ type: 'join', roomCode }));
};

socket.onmessage = (e) => {
  const data = JSON.parse(e.data);

  if (data.type === 'start') {
    document.querySelector('h2').innerText = 'Both players connected!';
    document.getElementById('buttons').style.display = 'block';
  }

  if (data.type === 'button') {
    updateButtonStyles(data.value);
  }
};

document.getElementById('yesBtn').onclick = () => {
  socket.send(JSON.stringify({ type: 'button', roomCode, value: 'yes' }));
  updateButtonStyles('yes');
};

document.getElementById('noBtn').onclick = () => {
  socket.send(JSON.stringify({ type: 'button', roomCode, value: 'no' }));
  updateButtonStyles('no');
};

function updateButtonStyles(value) {
  if (value === 'yes') {
    document.getElementById('yesBtn').style.backgroundColor = 'blue';
    document.getElementById('noBtn').style.backgroundColor = 'white';
  } else {
    document.getElementById('yesBtn').style.backgroundColor = 'white';
    document.getElementById('noBtn').style.backgroundColor = 'blue';
  }
}
