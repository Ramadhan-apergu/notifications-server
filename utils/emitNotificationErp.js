const notificationModel = require('../models/notificationModel');
let io;

const setSocket = (socketIo) => {
  io = socketIo;
};

const emitNotificationErp = async () => {
  try {
    if (io) {
      const page = 1;
      const limit = 50;
      const offset = (page - 1) * limit;

      const data = await notificationModel.getNotificationErpWithPagination(
        '',
        limit,
        offset,
        ''
      );
      const totalData = await notificationModel.getTotalNotifications('', '', 'erp');

      const totalPages = Math.ceil(totalData / limit);

      const notification = {
        page,
        totalPages,
        totalData,
        data,
      };

      io.emit('notification-erp:list', notification);
    }
  } catch (error) {
    console.log('Emit gagal ', error.message);
  }
};

module.exports = emitNotificationErp;
module.exports.setSocket = setSocket;
