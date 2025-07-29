const roomModel = require('../models/room');

exports.find = (req, res, next) => {
    roomModel.find()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot get data room.",
                error: err.message
            });
        });
}
