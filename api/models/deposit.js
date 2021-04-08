const { date } = require('joi');
const mongoose = require('mongoose');
const DepositSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    transactionID: {
        type: String,
        default: ''
    },
    transactionAmount: {
        type: String,
        default: ''
    },
    transactionType: {
        type: String,
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    transactionAccountNo: {
        type: String,
        default: ''
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Deposit', DepositSchema);