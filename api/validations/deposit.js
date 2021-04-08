const express = require("express");
const router = express.Router();
const Joi = require('@hapi/joi');
const Deposit = require('../controllers/deposit');


module.exports.createDeposit = (req, res, next) => {

    //@ start validation
    let userId = req.user.id;
    let requestedData = req.body;

    // define the validation schema
    const schema = Joi.object().keys({
        transactionID: Joi.any().required().label('Transaction ID').error(errors => { return { message: "Transaction ID is required." }; }),
        transactionAmount: Joi.any().required().label('Transaction Amount').error(errors => { return { message: "Transaction Amount is required." }; }),
        transactionType: Joi.any().required().label('Transaction Type').error(errors => { return { message: "Transaction Type is required." }; }),
        transactionDate: Joi.any().optional().label(' Transaction Date').error(errors => { return { message: "Transaction Date is required." }; }),
        transactionAccountNo: Joi.any().optional().label('Transaction Account No').error(errors => { return { message: "Transaction Account No is required." }; }),
    });

    // validate the request data against the schema
    const validateResult = Joi.validate(requestedData, schema, (err, value) => {
        return err;
    });
    if (validateResult) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request",
            detailedMessage: validateResult.details[0].message
        });
    }
    Deposit.addDeposit(userId, requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.getDeposit = (req, res, next) => {
    //@ start validation

    let offset = (req.query && req.query.offset) ? parseInt(req.query.offset) : 0;
    let limit = (req.query && req.query.limit) ? parseInt(req.query.limit) : 10;

    Deposit.getDepositDetails(offset, limit).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.getUserDeposit = (req, res, next) => {
    let userId = req.user.id;
    Deposit.getUserDepositDetails(userId).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}