let Notification = require('../models/notification'),
    User = require("../models/user");

//Utility function to "send" notification to user
function sendNotification(user, text) {

    new Notification({
        user: user,
        text: text
    }).save(function (err, result) {
        if (err || !result) {
            console.log("Error while saving notifications")
        } else {
            User.findById(user)
                .exec()
                .then(function (user) {
                    if (!user) {
                        throw "Error while retrieving user";
                    } else {
                        if (user.notifications) {
                            user.notifications.push(result);
                        } else {
                            user.notifications = [result];
                        }
                        user.save(function (err) {
                            if (err) {
                                console.log("Error while retrieving user")
                            }
                        })
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    });
}

//export the function
module.exports.sendNotification = sendNotification;