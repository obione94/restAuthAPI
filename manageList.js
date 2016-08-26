module.exports = function (server, db) {
var validateRequest = require("./validateRequest");

	server.get("/api/v1/bucketList/data/list", function (req, res, next) {
		validateRequest.validateToken(req, res, db, function (newauth) {
			if(newauth){

				db.bucketLists.find({
					token : req.params.email
				},function (err, list) {
					res.writeHead(200, {
						'Content-Type': 'application/json; charset=utf-8',
						'Token':newauth.token
					});
					res.end(JSON.stringify(list));
				});
			}
		});
		return next();
	});

	server.get('/api/v1/bucketList/data/item/:id', function (req, res, next) {
		validateRequest.validateToken(req, res, db, function (newauth) {
			if(newauth){
				db.bucketLists.find({
					_id: db.ObjectId(req.params.id)
				}, function (err, data) {
					res.writeHead(200, {
						'Content-Type': 'application/json; charset=utf-8',
						'Token':newauth.token
					});
					res.end(JSON.stringify(data));
				});
			}

		});
		return next();
	});

	server.post('/api/v1/bucketList/data/item', function (req, res, next) {
		validateRequest.validateToken(req, res, db, function (newauth) {
			var item = req.params;
			db.bucketLists.save(item,
			function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8',
					'Token':newauth.token				
				});
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});

	server.put('/api/v1/bucketList/data/item/:id', function (req, res, next) {
		validateRequest.validateToken(req, res, db, function (newauth) {
		db.bucketLists.findOne({
			_id: db.ObjectId(req.params.id)
		}, function (err, data) {
				// merge req.params/product with the server/product
				var updProd = {}; // updated products 
				// logic similar to jQuery.extend(); to merge 2 objects.
				for (var n in data) {
					updProd[n] = data[n];
				}
				for (var n in req.params) {
					if (n != "id")
					updProd[n] = req.params[n];
				}

				db.bucketLists.update({
					_id: db.ObjectId(req.params.id)
				}, updProd, {
					multi: false
				}, function (err, data) {
					res.writeHead(200, {
						'Content-Type': 'application/json; charset=utf-8',
						'Token':newauth.token	
					});
					res.end(JSON.stringify(data));
				});
			});
		});
		return next();
	});

	server.del('/api/v1/bucketList/data/item/:id', function (req, res, next) {
		validateRequest.validateToken(req, res, db, function (newauth) {
			db.bucketLists.remove({
				_id: db.ObjectId(req.params.id)
			}, function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8',
					'Token':newauth.token	
				});
				res.end(JSON.stringify(data));
			});
			return next();
		});
	});
}