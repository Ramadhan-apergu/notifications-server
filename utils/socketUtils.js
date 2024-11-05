const notificationModel = require('../models/notificationModel');
let io;

const setSocket = (socketIo) => {
  io = socketIo;
};

const emitNotification = async () => {
  try {
    if (io) {
      const search = '';
      const page = 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const data = await notificationModel.getNotificationsWithPagination(
        search,
        limit,
        offset
      );
      const totalData = await notificationModel.getTotalNotifications(search);

      const totalPages = Math.ceil(totalData / limit);

      const notification = {
        page,
        totalPages,
        totalData,
        data,
      };

      io.emit('notification:list', notification);
    }
  } catch (error) {
    console.log('Emit gagal ', error.message);
  }
};

module.exports = emitNotification;
module.exports.setSocket = setSocket;
