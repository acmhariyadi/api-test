const express = require('express');
const router = express.Router();

const attendancesController = require("../controllers/attendances");

/* 
[GET] /v1/attendances
Get attendances of all users
*/
router.get('/', attendancesController.getAttendances);

/* 
[GET] /v1/attendances/{userId}
Get attendances by user id
*/
router.get('/:userId', attendancesController.getAttendancesByUser);

/* 
[POST] /v1/attendances/checkIn
Check in attendance of current user
*/
router.post('/checkIn', attendancesController.checkIn);

/* 
[POST] /v1/attendances/checkOut
Check out attendance of current user
*/
router.put('/checkOut/:userId', attendancesController.checkOut);

module.exports = router;
