const express = require('express');
const roomRouter = express.Router();
const roomController = require('../controllers/room');

// Route to get all room data
roomRouter.get('/find', roomController.find)

module.exports = roomRouter;
