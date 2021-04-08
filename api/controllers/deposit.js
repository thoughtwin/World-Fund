const { date } = require("joi");
const mongoose = require("mongoose");
const Deposit = require("../models/deposit");

module.exports.addDeposit = (userId, data) => {
    return new Promise((resolve, reject) => {
        const deposit = new Deposit({
            userId: userId,
            transactionID: data.transactionID,
            transactionType: data.transactionType,
            transactionAmount: data.transactionAmount,
            transactionAccountNo: data.transactionAccountNo
        }).save().then((depositResult) => {
            const responseData = {
                'status': 200,
                'success': true,
                'Data': depositResult,
                'message': 'Deposit Save Successfully.',
            }
            resolve(responseData)

        }).catch((err) => reject('Requested resource not found'));
    });
}

module.exports.getDepositDetails = (offset, limit) => {
    console.log("data", offset, limit);
    return new Promise((resolve, reject) => {
        var nextOffset = offset + limit;
        Deposit.find({}).limit(limit).skip(offset).exec((error, depositResult) => {
            if (depositResult == null) {
                const responseData = {
                    status: 201,
                    'success': false,
                    'message': 'depositId not found.',

                }
                resolve(responseData)
            } else {
                const responseData = {
                    'status': 200,
                    'success': true,
                    'message': 'Deposit get Successfully.',
                    'offset': nextOffset,
                    "data": depositResult
                }
                resolve(responseData)
            }
        })
    });
}

module.exports.getUserDepositDetails = (userId) => {
    return new Promise((resolve, reject) => {
        Deposit.find({
            userId: userId
        }).sort({ createdAt: 1 }).then((depositResult) => {
            if (depositResult == null) {
                const responseData = {
                    status: 201,
                    'success': false,
                    'message': 'depositId not found.',

                }
                resolve(responseData)
            } else {
                const responseData = {
                    'status': 200,
                    'success': true,
                    'message': 'User Deposit get Successfully.',
                    "totalCount": depositResult.length,
                    "data": depositResult
                }
                resolve(responseData)
            }
        }).catch((err) => reject('Requested resource not found'));
    });
}