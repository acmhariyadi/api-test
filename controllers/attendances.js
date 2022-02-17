const client = require('../config/pg');

exports.getAttendances = (req, res) => {
    const query = {text: `SELECT * FROM attendace_log;`}
    return client.client.query(query).then((result) => {
        res.send({
            success: true,
            message: "fetched",
            payload: result['rows']
        })
    }).catch((err) => {
        console.log("Result : " + err.toString());
        res.send({ success: false, message: err.toString() })
    })
}

exports.getAttendancesByUser = (req, res) => {
    const query = {
        text: `SELECT * FROM attendace_log WHERE userId = $1;`,
        values: [req.params.userId]
    }
    return client.client.query(query).then((result) => {
        res.send({
            success: true,
            message: "fetched",
            payload: result['rows']
        })
    }).catch((err) => {
        console.log("Result : " + err.toString());
        res.send({ success: false, message: err.toString() })
    })
}

exports.checkIn = (req, res) => {

    var payload = [
        req.body['userId'],
        req.body['checkInlocation'],
        req.body['date'],
        req.body['checkInTime'],
        req.body['notes'],
    ]
    console.log(">>> CheckIn API (Payload) : " + JSON.stringify(payload));

    req.checkBody('userId', 'userId is required').notEmpty();
    req.checkBody('checkInlocation', 'checkInlocation is required').notEmpty();
    req.checkBody('date', 'date is required').notEmpty();
    req.checkBody('checkInTime', 'checkInTime is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.send({ success: false, message: errors }) 
    }
    
    const selectUserByDate = {
        text: `SELECT * FROM attendance_log WHERE userId = $1 AND date = $2`,
        values: [ req.body['userId'],req.body['date'] ]
    }

    const insertlog = {
        text: `INSERT INTO attendance_log (userId, check_in_location, date, check_in_time, notes) 
                VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
        values: payload
    }

    // check if the user has checked in
    return client.client.query(selectUserByDate).then((selectResult) => {

        // if the user has checked in on the same day, then the user cannot check in again
        if(selectResult.rowCount > 0){
            res.send({ 
                success: false, 
                message: "userId already checkIn", 
                result: "",
             })
        } 
        
        return client.client.query(insertlog);
    
    }).then(insertResult => {
            
        res.send({ 
            success: true, 
            message: "checkIn successfully", 
            result: insertResult.rows[0].id,
         })
            
    }).catch((err) => {
        console.log("Result : " + err.toString());
        res.send({ success: false, message: err.toString() });
    })
}

exports.checkOut = (req, res) => {

    var payload = [
        req.param.userId,
        req.body['checkOutLocation'],
        req.body['date'],
        req.body['checkOutTime'],
        req.body['notes'],
    ]
    console.log(">>> CheckOut API (Payload) : " + JSON.stringify(payload));

    req.checkBody('checkOutLocation', 'checkOutLocation is required').notEmpty();
    req.checkBody('date', 'date is required').notEmpty();
    req.checkBody('checkOutTime', 'checkOutTime is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.send({ success: false, message: errors }) 
    }
    
    const selectUserByDate = {
        text: `SELECT * FROM attendance_log WHERE userId = $1 AND date = $2`,
        values: [  req.param.userId, req.body['date'] ]
    }

    const updateLog = {
        text: `UPDATE attendance_log SET check_out_time = $1, check_out_location = $2 WHERE userId=$3;`,
        values: [req.body['checkOutTime'], req.body['checkOutLocation'], req.params.userId]
    }

    // check if the user has checked in
    return client.client.query(selectUserByDate).then((selectResult) => {

        // if the user hasn't checked then the user can't checkout
        if(selectResult.rowCount == 0){
            res.send({ 
                success: false, 
                message: "userId must be checkIn", 
                result: "",
             })
        } 
        
        return client.client.query(updateLog);
    
    }).then(updatedResult => {
            
        res.send({ 
            success: true, 
            message: "checkOut successfully", 
            result: "",
         })
            
    }).catch((err) => {
        console.log("Result : " + err.toString());
        res.send({ success: false, message: err.toString() });
    })
}