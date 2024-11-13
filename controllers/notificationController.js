const notificationModel = require('../models/notificationModel');
const getDateNow = require('../utils/getDateNow');
const emitNotification = require('../utils/emitNotification');
const emitNotificationCrm = require('../utils/emitNotificationCrm');
const emitNotificationErp = require('../utils/emitNotificationErp');
const emitNotificationDashboard = require('../utils/emitNotificationDashboard');


const getNotifications = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
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
      filter,
      ''
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
    await emitNotificationCrm();
    await emitNotificationErp();
    await emitNotificationDashboard()

    res.status(201).json({ message: 'Create data Successfully!' });
  } catch (error) {
    next(error);
  }
};

const getNotificationCrm = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const filter = req.query.filter || '';

    const data = await notificationModel.getNotificationCrmWithPagination(
      search,
      limit,
      offset,
      filter
    );
    const totalData = await notificationModel.getTotalNotifications(
      search,
      filter,
      'crm'
    );

    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      page,
      totalPages,
      totalData,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getNotificationErp = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const filter = req.query.filter || '';

    const data = await notificationModel.getNotificationErpWithPagination(
      search,
      limit,
      offset,
      filter
    );

    const totalData = await notificationModel.getTotalNotifications(
      search,
      filter,
      'erp'
    );

    const totalPages = Math.ceil(totalData / limit);

    res.status(200).json({
      page,
      totalPages,
      totalData,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getNotificationDashboard = async (req, res, next) => {
  try {
    const result = await notificationModel.getDataDashboard()
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  addNotifications,
  getNotificationCrm,
  getNotificationErp,
  getNotificationDashboard
};
