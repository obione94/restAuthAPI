module.exports = function (server, db) {
var validateRequest = require("./validateRequest");

	server.get("/api/v1/placetobe/data/list", function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.placetobes.find({
				user : req.params.user
			},function (err, list) {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8',
					'Token':'coucou'
				});
				res.end(JSON.stringify(list));
			});
		});
		return next();
	});

	server.get('/api/v1/placetobe/data/item/:id', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.placetobes.find({
				_id: db.ObjectId(req.params.id)
			}, function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8',
					'Token':'coucou'
				});
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});

	server.post('/api/v1/placetobe/data/item', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			var item = req.params;
			db.placetobes.save(item,
			function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
				});
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});

	server.put('/api/v1/placetobe/data/item/:id', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
		db.placetobes.findOne({
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

				db.placetobes.update({
					_id: db.ObjectId(req.params.id)
				}, updProd, {
					multi: false
				}, function (err, data) {
					res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
					});
					res.end(JSON.stringify(data));
				});
			});
		});
		return next();
	});
	server.del('/api/v1/placetobe/data/item/:id', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.placetobes.remove({
			_id: db.ObjectId(req.params.id)
			}, function (err, data) {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
				});
				res.end(JSON.stringify(data));
			});
			return next();
		});
	});
}