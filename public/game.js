const socket = new WebSocket(`wss://${window.location.host}`);
const roomCode = localStorage.getItem('roomCode');

socket.onopen = () => {
  socket.send(JSON.stringify({ type: 'join', roomCode }));
};

socket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === 'button') {
    if (data.value === 'yes') {
  document.getElementById('yesBtn').style.backgroundColor = 'blue';
  document.getElementById('noBtn').style.backgroundColor = 'white';
}

if (data.value === 'no') {
  document.getElementById('yesBtn').style.backgroundColor = 'white';
  document.getElementById('noBtn').style.backgroundColor = 'blue';
}

  }
};

document.getElementById('yesBtn').onclick = () => {
  socket.send(JSON.stringify({ type: 'button', roomCode, value: 'yes' }));
};

document.getElementById('noBtn').onclick = () => {
  socket.send(JSON.stringify({ type: 'button', roomCode, value: 'no' }));
};
