const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const {
    verifyEmail
} = require('../Utils/verifyEmail');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const bcrypt = require("bcrypt-nodejs");





exports.userSignup = (data) => {
    return new Promise((resolve, reject) => {
        User.find({
            email: data.email
        }).then(userResult => {
            console.log("userResult", userResult.length);
            if (userResult.length == 0) {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: data.email,
                    image: data.image,
                    userName: data.userName,
                    invitedBy: data.invitedBy,
                    isVerified: false,
                    pinCode: data.pinCode,
                    password: data.password,
                    role: data.role || 'user'

                });
                user.save().then(result => {
                    // var token = jwt.sign({ email: result.email }, process.env.SECRET_KEY, { expiresIn: '24h' });
                    // console.log("token", token);

                    // var urlgenerate = `${process.env.URL}?email=${result.email}&token=${token}`
                    // var transporter = nodemailer.createTransport({
                    //     service: 'gmail',
                    //     auth: {
                    //         user: "tapish.thoughtwin@gmail.com",
                    //         pass: "Psd@12345#"
                    //     }
                    // });

                    // var mailOptions = verifyEmail(result.email, urlgenerate);

                    // transporter.sendMail(mailOptions, function (error, info) {
                    //     if (error) {
                    //         console.log(error);
                    //     } else {
                    //         console.log("Email send Successfully", info);

                    //     }
                    // });
                    const token = jwt.sign({
                        _id: result._id,
                        email: result.email,
                        userName: result.userName,
                        role: result.role,
                        transactionId:result.transactionId,
                        isVerified: result.isVerified
                    },
                        'secret', {
                        expiresIn: "365d"
                    }
                    );
                    const responseData = {
                        'status': 200,
                        'message': "User created successfully, Please Login.",
                         token:token,
                        'registerStatus': true,
                        'userName': result.userName
                    }
                    resolve(responseData)

                }).catch(err => {
                    reject({
                        error: err
                    });
                });
            } else {
                if (userResult[0].isVerified == true) {
                    resolve({
                        status: 201,
                        message: "Email already exists",
                        "registerStatus": false
                    });
                } else {
                    var token = jwt.sign({ email: userResult[0].email }, process.env.SECRET_KEY, { expiresIn: '24h' });
                    var urlgenerate = `${process.env.URL}?email=${userResult[0].email}&token=${token}`
                    console.log("urlgenerate", urlgenerate);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "tapish.thoughtwin@gmail.com",
                            pass: "Psd@12345#"
                        }
                    });

                    var mailOptions = verifyEmail(userResult[0].email, urlgenerate);

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            // console.log("Email send Successfully", info);

                        }
                    });
                    const responseData = {
                        'status': 200,
                        'message': "User created successfully",
                        'registerStatus': true,
                    }
                    resolve(responseData)
                }
            }

        }).catch((err) => { console.log("err", err); reject("Something is wrong") })
    });
}

exports.userUpdateTransactionId = (userId, data) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({
            _id: userId
        }, {
            '$set': data
        }, {
            'new': true
        }).then((result) => {
            if (result == null) {
                const responseData = {
                    status: 400,
                    'success': false,
                    'message': 'userId not found.',
                }
                resolve(responseData)
            } else {
                const responseData = {
                    status: 200,
                    'success': true,
                    'message': 'Please, Wait till Verification.',
                    'data': result,
                }
                resolve(responseData)
            }
        }).catch((error) => reject(error + ' Fail to update Transaction Id'));
    });
};


// exports.emailVerify = (data) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(data.token, process.env.SECRET_KEY, async (err, decoded) => {
//             if (err) {
//                 const responseData = {
//                     'status': 201,
//                     'message': "Please Register your User",
//                 }
//                 resolve(responseData)
//             } else {
//                 User.find({
//                     email: decoded.email
//                 }).then((result) => {
//                     if (result.length == 0) {
//                         const responseData = {
//                             'status': 201,
//                             'message': "Please Register your User",
//                         }
//                         resolve(responseData)
//                     } else {
//                         if (result[0].isVerified == true) {
//                             const responseData = {
//                                 'status': 200,
//                                 'message': "Your Account is Already Verified",
//                             }
//                             resolve(responseData)
//                         }
//                         User.findOneAndUpdate({
//                             email: result[0].email
//                         }, {

//                             '$set': {
//                                 'isVerified': true
//                             }
//                         }, {
//                             'new': true
//                         }).then((updateResult) => {
//                             // console.log("updateResult" + updateResult)
//                         }).catch((error) => reject(error))

//                         const responseData = {
//                             'status': 200,
//                             'message': "Your Account Verified Succesfully",
//                         }
//                         resolve(responseData)
//                     }

//                 }).catch((err) => {
//                     const responseData = {
//                         'status': 400,
//                         'message': err
//                     }
//                     resolve(responseData)
//                 })
//             }

//         });

//     });
// }

exports.resendEmailVerify = (data) => {
    return new Promise((resolve, reject) => {
        var token = jwt.sign({ email: data.email }, process.env.SECRET_KEY, { expiresIn: '24h' });
        console.log("token", token);

        var urlgenerate = `${process.env.URL}?email=${data.email}&token=${token}`
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "tapish.thoughtwin@gmail.com",
                pass: "Psd@12345#"
            }
        });
        var mailOptions = verifyEmail(data.email, urlgenerate);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // console.log("Email send Successfully", info);

            }
        });
        const responseData = {
            'status': 200,
            'message': "Email Send Successfully",
        }
        resolve(responseData)

    });
}


module.exports.userLogin = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: data.email
        }).then((userResult) => {
            if (userResult === null) {
                const responseData = {
                    status: 201,
                    message: 'Invalid username and password ',
                }
                resolve(responseData)

            } else {
                userResult.comparePassword(data.password, userResult.password, (err, isMatch) => {
                    if (err) {
                        const responseData = {
                            success: false,
                            msg: 'Something is wrong',
                        }
                        resolve(responseData)
                    }
                    if (isMatch) {

                        const token = jwt.sign({
                            _id: userResult._id,
                            email: userResult.email,
                            userName: userResult.userName,
                            role: userResult.role,
                            transactionId:userResult.transactionId,
                            isVerified:userResult.isVerified,
                        },
                            'secret', {
                            expiresIn: "365d"
                        }
                        );
                        const responseData = {
                            status: 200,
                            'message': "login successful",
                            'success': true,
                            token: token,
                            'userName': userResult.userName

                        }
                        resolve(responseData)
                    } else {
                        const responseData = {
                            status: 201,
                            message: "Invalid username and password",
                            'success': false,
                        }
                        resolve(responseData)
                    }
                })
            }
        }).catch((error) => {
            reject('Requested resource not found')
        })
    })
};

module.exports.passwordForgot = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: data.email
        }).then(user => {
            if (user) {
                var password = generator.generate({
                    length: 10,
                    numbers: true
                });
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        return next(err);
                    }
                    bcrypt.hash(password, salt, null, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        password = hash;
                        User.findOneAndUpdate({
                            _id: user._id
                        }, {
                            '$set': {
                                password: password
                            }
                        }, {
                            'new': true
                        }).then((passwordData) => { }).catch((error) => console.log('error = ' + error))
                    });
                });
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "worldfunds20@gmail.com",
                        pass: "Worldfunds@123"
                    }
                });

                var mailOptions = {
                    from: 'youremail@gmail.com',
                    to: data.email,
                    subject: 'Forgot Password ',
                    text: 'That is the New Password! =   ' + password,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {

                    }
                });
                const responseData = {
                    status: 200,
                    'success': true,
                    'message': ' Password send successfully on Your Email .',
                }
                resolve(responseData)
            } else {
                const responseData = {
                    status: 201,
                    success: false,
                    msg: 'Email Id not found',
                }
                resolve(responseData)
            }
        });
    });
};

module.exports.ProfileUpdate = (userId, data) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({
            _id: userId
        }, {
            '$set': data
        }, {
            'new': true
        }).then((result) => {
            if (result == null) {
                const responseData = {
                    status: 201,
                    'success': false,
                    'message': 'userId not found.',
                }
                resolve(responseData)
            } else {
                const responseData = {
                    status: 200,
                    'success': true,
                    'message': 'User Update successfully.',
                    'data': result,
                }
                resolve(responseData)
            }
        }).catch((error) => reject(error + ' Fail to update profileId'))
    })
};

module.exports.userDetails = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: userId
        }).then((result) => {
            if (result == null) {
                const responseData = {
                    status: 201,
                    'success': false,
                    'message': 'userId not found.',
                }
                resolve(responseData)
            } else {
                const responseData = {
                    status: 200,
                    'success': true,
                    'message': 'Get User Details successfully.',
                    'data': result,
                }
                resolve(responseData)
            }
        }).catch((error) => reject(error + ' Fail to update profileId'))
    })
};

module.exports.passwordChange = (userId, data) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: userId
        }).then(user => {
            if (user) {
                user.comparePassword(data.oldPassword, user.password, (err, isMatch) => {
                    if (err) {
                        const responseData = {
                            success: false,
                            msg: 'Something is wrong',
                            data: []
                        }
                        resolve(responseData)
                    }
                    if (isMatch) {
                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) {
                                return next(err);
                            }
                            bcrypt.hash(data.newPassword, salt, null, function (err, hash) {
                                if (err) {
                                    return next(err);
                                }
                                data.newPassword = hash;
                                User.findOneAndUpdate({
                                    _id: user._id
                                }, {
                                    '$set': {
                                        password: data.newPassword
                                    }
                                }, {
                                    'new': true
                                }).then((data) => {
                                    const responseData = {
                                        status: 200,
                                        success: true,
                                        msg: 'Password change successfully.',
                                    }
                                    resolve(responseData)
                                }).catch((error) => reject('error = ' + error))
                            });
                        });

                    } else {
                        const responseData = {
                            status: 201,
                            success: false,
                            msg: 'Old password not correct',
                            data: []

                        }
                        resolve(responseData)
                    }
                })
            } else {
                const responseData = {
                    status: 201,
                    success: false,
                    msg: 'User not found',
                    data: []
                }
                resolve(responseData)
            }
        }).catch((error) => reject('Something is wrong'))

    });
};

module.exports.allUsers = () => {
    return new Promise((resolve, reject) => {
        User.find({
            $and:[{role: "user"},{"transactionId": { $ne : "" }}]
        }).then((result) => {
            if (result == null) {
                const responseData = {
                    status: 201,
                    'success': false,
                    'message': 'userId not found.',
                }
                resolve(responseData)
            } else {
                const responseData = {
                    status: 200,
                    'success': true,
                    'message': 'All Users with transcation ID',
                    'data': result,
                }
                resolve(responseData)
            }
        }).catch((error) => reject(error + 'something is wrong'));
    })
};

module.exports.updateUserVerified = (userId, data)=>{
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({
            $and:[{_id: userId}, {"transactionId": { $ne : "" }}]
        }, {
            '$set': data
        }, {
            'new': true
        }).then((result) => {
            if (result == null) {
                const responseData = {
                    status: 400,
                    'success': false,
                    'message': 'userId not found.',
                }
                resolve(responseData)
            } else {
                const responseData = {
                    status: 200,
                    'success': true,
                    'message': 'User Update successfully.',
                    'data': result,
                }
                resolve(responseData)
            }
        }).catch((error) => reject(error + ' Fail to update'));
    });
};