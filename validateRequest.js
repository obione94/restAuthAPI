var pwdMgr = require('./managePasswords');

var isEmailValid = function (db, email, callback) {
    db.user.findOne({
        email: email
    }, function (err, user) {
        callback(user);
    });
};

var isTokenValid = function (db, token_, callback) {
    db.auth.findOne({
        token: token_
    }, function (err, auth) {
         callback(auth);
    });
};

var insertTokenValid = function (db, token_, callback) {
    pwdMgr.genereToken(function (err, hash) {
        if (hash) {
            db.auth.insert({
                token: hash
            }, function (err, newauth) {
                console.log(err);
                callback(newauth); 
            });

        } else {
           callback();
        }
    });
};
 
module.exports.validate = function (req, res, db, callback) {
    // if the request dosent have a header with email, reject the request
    if (!req.params.token) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "You are not authorized to access this application",
            message: "An Email is required as part of the header"
        }));
    };
 
 
    isEmailValid(db, req.params.token, function (user) {
        if (!user) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "You are not authorized to access this application",
                message: "Invalid User Email"
            }));
        } else {
            callback();
        }
    });
};

module.exports.validateToken = function (req,res , db, callback) {
    // if the request dosent have a header with email, reject the request
    if (!req.headers.token) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "You are not authorized to access this application",
            message: "An Token is required as part of the header"
        }));
    };
 
 
    isTokenValid(db, req.headers.token, function (auth) {
        if (!auth) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "You are not authorized to access this application",
                message: "Invalid User Token"
            }));
        } else {


            db.auth.remove({
            _id: db.ObjectId(auth._id)
            }, function (err, data) {
                if(err){
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "cant remove expire token",
                        message: "impossible de remove token expirer"
                    }));

                } else {

                    insertTokenValid(db, req.headers.token, function (newauth) {
                        if (!newauth) {
                            res.writeHead(403, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                error: "You are not authorized to access this application",
                                message: "can't regene User Token"
                            }));
                        } else {
                            callback(newauth);
                        }
                    });
                    
                }

            });

            
        }
    });
};