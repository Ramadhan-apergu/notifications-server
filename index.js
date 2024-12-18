const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const notificationRoutes = require('./routes/notificationRoutes');
const emitNotification = require('./utils/emitNotification');
const emitNotificationCrm = require('./utils/emitNotificationCrm')
const emitNotificationErp = require('./utils/emitNotificationErp')
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const emitNotificationDashboard = require('./utils/emitNotificationDashboard');
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

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
});

app.use('/api', notificationRoutes);
app.use(errorHandler);

emitNotification.setSocket(io);
io.on('connection', (socket) => {
  console.log('New client connected to main namespace');
  emitNotification();
  socket.on('disconnect', () => console.log('Client disconnected from main namespace'));
});

const crmNamespace = io.of('/crm');
emitNotificationCrm.setSocket(crmNamespace);
crmNamespace.on('connection', (socket) => {
  console.log('New client connected to crm namespace');
  emitNotificationCrm();
  socket.on('disconnect', () => console.log('Client disconnected from crm namespace'));
});

const erpNamespace = io.of('/erp');
emitNotificationErp.setSocket(erpNamespace);
erpNamespace.on('connection', (socket) => {
  console.log('New client connected to erp namespace');
  emitNotificationErp();
  socket.on('disconnect', () => console.log('Client disconnected from erp namespace'));
});

const dashboardNamespace = io.of('/dashboard');
emitNotificationDashboard.setSocket(dashboardNamespace);
dashboardNamespace.on('connection', (socket) => {
  console.log('New client connected to dashboard namespace');
  emitNotificationDashboard();
  socket.on('disconnect', () => console.log('Client disconnected from dashboard namespace'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
