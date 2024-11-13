const notificationModel = require('../models/notificationModel');
let io;

const setSocket = (socketIo) => {
  io = socketIo;
};

const emitNotificationDashboard = async () => {
  try {
    if (io) {
        const result = await notificationModel.getDataDashboard()

        io.emit('notification:dashboard', result);
    }
  } catch (error) {
    console.log('Emit gagal ', error.message);
  }
};

module.exports = emitNotificationDashboard;
module.exports.setSocket = setSocket;
