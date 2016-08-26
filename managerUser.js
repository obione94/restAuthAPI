var pwdMgr = require('./managePasswords');
 
module.exports = function (server, db) {
    // unique index
    db.user.ensureIndex({
        email: 1
    }, {
        unique: true
    })
 
    server.post('/api/v1/bucketList/user/register', function (req, res, next) {
        var user = req.params;
        pwdMgr.cryptPassword(user.password, function (err, hash) {
            user.password = hash;
            console.log("n", hash);
            db.user.insert(user,
                function (err, dbUser) {
                    if (err) { // duplicate key error
                        if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                            res.writeHead(400, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                error: err,
                                message: "A user with this email already exists"
                            }));
                        }
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        dbUser.password = "";
                        res.end(JSON.stringify(dbUser));
                    }
                });
        });
        return next();
    });
 
    server.post('/api/v1/bucketList/user/login', function (req, res, next) {

        pwdMgr.genereToken(function (err, hash) {
            if (hash) {
                db.auth.insert({
                    token: hash
                }, function (err, auth) {
                    if(auth){                        
                        var user = req.params;
                        if (user.email.trim().length == 0 || user.password.trim().length == 0) {
                            res.writeHead(403, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                error: "Invalid Credentials"
                            }));
                        }
                        console.log("in");
                        db.user.findOne({
                            email: user.email
                        }, function (err, dbUser) {
                            if(dbUser){

                                console.log(dbUser);
                                pwdMgr.comparePassword(user.password, dbUser.password, function (err, isPasswordMatch) {
                     
                                    if (isPasswordMatch) {
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json; charset=utf-8',
                                            'Token': hash
                                        });
                                        // remove password hash before sending to the client
                                        dbUser.password = "";
                                        res.end(JSON.stringify(dbUser));
                                    } else {
                                        res.writeHead(403, {
                                            'Content-Type': 'application/json; charset=utf-8'
                                        });
                                        res.end(JSON.stringify({
                                            error: "Invalid User"
                                        }));
                                    }
                     
                                });
                                
                            }else{
                                res.writeHead(403, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });
                                res.end(JSON.stringify({
                                    error: "can't find "+user.email
                                }));

                            }
                        });
                    }else{
                        res.writeHead(403, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: "can't insert token"
                        }));

                    }

                });

            }else{

                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    error: "Invalid token"
                }));
            }
        });


        return next();
    });

};