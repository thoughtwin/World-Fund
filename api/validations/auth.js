const express = require("express");
const router = express.Router();
const Joi = require('@hapi/joi');
const User = require('../controllers/user');


module.exports.signUp = (req, res, next) => {

    //@ start validation
    let requestedData = req.body;

    // define the validation schema
    const schema = Joi.object().keys({
        userName: Joi.any().required().label('User Name').error(errors => { return { message: "User Name is required." }; }),
        email: Joi.any().required().label('Email ID').error(errors => { return { message: "Email ID is required." }; }),
        password: Joi.any().required().label('password').error(errors => { return { message: "password is required." }; }),
        pinCode: Joi.any().optional().label(' Pin Code'),
        invitedBy: Joi.any().optional().label('Invited By'),
        isVerified: Joi.any().optional().label('Is Verified'),
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
    User.userSignup(requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

// module.exports.verifyEmail = (req, res, next) => {

//     //@ start validation
//     let requestedData = req.query;

//     // define the validation schema
//     const schema = Joi.object().keys({
//         token: Joi.any().required().label('token').error(errors => { return { message: "token is required." }; }),
//         email: Joi.any().required().label('Email ID').error(errors => { return { message: "Email ID is required." }; }),
//     });

//     // validate the request data against the schema
//     const validateResult = Joi.validate(requestedData, schema, (err, value) => {
//         return err;
//     });
//     if (validateResult) {
//         return res.status(400).json({
//             status: 400,
//             message: "Bad Request",
//             detailedMessage: validateResult.details[0].message
//         });
//     }
//     User.emailVerify(requestedData).then((responseData) => res.json(responseData)).
//         catch((err) => next(err));
// }

module.exports.emailResend = (req, res, next) => {

    //@ start validation
    let requestedData = req.body;

    // define the validation schema
    const schema = Joi.object().keys({
        email: Joi.any().required().label('Email ID').error(errors => { return { message: "Email ID is required." }; }),
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
    User.resendEmailVerify(requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.Login = (req, res, next) => {

    //@ start validation
    let requestedData = req.body;

    // define the validation schema
    const schema = Joi.object().keys({
        email: Joi.any().required().label('Email ID').error(errors => { return { message: "Email ID is required." }; }),
        password: Joi.any().required().label('password').error(errors => { return { message: "password is required." }; }),
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
    User.userLogin(requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.getUserDetails = (req, res, next) => {
    //@ start validation
    const userId = req.user.id;
    User.userDetails(userId).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.forgotPassword = (req, res, next) => {

    //@ start validation
    let requestedData = req.body;

    // define the validation schema
    const schema = Joi.object().keys({
        email: Joi.any().required().label('Email ID').error(errors => { return { message: "Email ID is required." }; }),
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
    User.passwordForgot(requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.updateUserDetail = (req, res, next) => {
    //@ start validation
    const userId = req.user.id;
    let requestedData = req.body;
    // define the validation schema
    const schema = Joi.object().keys({
        userName: Joi.any().optional().label('User Name'),
        pinCode: Joi.any().optional().label('pin code'),
        static1: Joi.any().optional().label('static1'),
        static2: Joi.any().optional().label('static2'),
        static3: Joi.any().optional().label('static3'),
        static4: Joi.any().optional().label('static4'),
        static5: Joi.any().optional().label('static5'),
        static6: Joi.any().optional().label('static6'),
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
    User.ProfileUpdate(userId, requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));
}

module.exports.changePassword = (req, res, next) => {
    //@ start validation
    const userId = req.user.id
    let requestedData = req.body;

    // define the validation schema
    const schema = Joi.object().keys({
        newPassword: Joi.any().required().label('New Password').error(errors => { return { message: "New Password is required." }; }),
        oldPassword: Joi.any().required().label('Old Password').error(errors => { return { message: "Old Password is required." }; }),
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
    User.passwordChange(userId, requestedData).then((responseData) => res.json(responseData)).
        catch((err) => next(err));

};