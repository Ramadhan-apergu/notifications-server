const express = require('express');
const notificationController = require('../controllers/notificationController');
const authentication = require('../middlewares/authentication');

const router = express.Router();

router.get('/notifications', notificationController.getNotifications);
router.post(
  '/notifications',
  authentication,
  notificationController.addNotifications
);

module.exports = router;
