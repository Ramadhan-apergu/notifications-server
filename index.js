const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const notificationRoutes = require('./routes/notificationRoutes');
const emitNotification = require('./utils/socketUtils');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: '*'
}));
app.use(morgan('tiny'));

app.use(express.json());

app.use('/api', notificationRoutes);
app.use(errorHandler);

emitNotification.setSocket(io);

io.on('connection', (socket) => {
  console.log('New client connected');
  emitNotification();
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
