import openSocket from 'socket.io-client';
import axios from 'axios';
import ROUTES from './routes';
const socket = openSocket(ROUTES[process.env.REACT_APP_NODE_ENV].socket);

// subscribe to a userId's notification - must be the jwt token
function subscribeToNotifications(userId, cb) {
  let authorized = localStorage.getItem('giving_tree_jwt');
  const headers = {
    headers: {
      Authorization: `Bearer ${authorized}`
    }
  };

  if (authorized) {
    socket.on('notification', notification => cb(null, notification));
    localStorage.setItem('sessionId', socket.id);

    axios
      .post(`${ROUTES[process.env.REACT_APP_NODE_ENV].giving_tree}/socket`, { sessionId: socket.id }, headers)
      .then(success => {
        console.log('success updated socket');
      })
      .catch(err => {
        console.log('error updating socket');
      });
  }
}

export { subscribeToNotifications };
