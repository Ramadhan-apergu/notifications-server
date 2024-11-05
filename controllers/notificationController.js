const notificationModel = require('../models/notificationModel');
const getDateNow = require('../utils/getDateNow');
const emitNotification = require('../utils/socketUtils');

const getNotifications = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const filter = req.query.filter || '';

    const data = await notificationModel.getNotificationsWithPagination(
      search,
      limit,
      offset,
      filter
    );
    const totalData = await notificationModel.getTotalNotifications(
      search,
      filter
    );

    const totalPages = Math.ceil(totalData / limit);

    res.json({
      page,
      totalPages,
      totalData,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const addNotifications = async (req, res, next) => {
  try {
    let { type, name, source, detail, datetime } = req.body;

    if (!type || !name || !source || !detail) {
      throw { name: 'BadRequest' };
    }

    if (!datetime) {
      datetime = getDateNow();
    }

    const response = await notificationModel.createNotification({
      type,
      name,
      source,
      detail,
      datetime,
    });

    if (response == 0) {
      throw { name: 'FailedCreateData' };
    }

    await emitNotification();

    res.status(201).json({ message: 'Create data Successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  addNotifications,
};
