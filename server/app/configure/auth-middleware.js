'use strict';

var Auth = {};

Auth.isAuthenticated = function (req) {
	return !!req.user;
};

Auth.isAdmin = function (req) {
	return req.user && req.user.isAdmin;
};

Auth.isSelf = function (req) {
	return req.user.equals(req.user); //change to requested user
};

Auth.isAuthor = function (req) {
	return req.user.equals(req.task.seller);
};

Auth.assert = function (assertion, status) {
	return function (req, res, next, err) {
		if (assertion(req)) next();
		else next(err);
	}
};

Auth.assertAuthenticated = Auth.assert(Auth.isAuthenticated, 401);

Auth.assertAdmin = Auth.assert(Auth.isAdmin);

Auth.assertSelf = Auth.assert(Auth.isSelf);

Auth.assertOwner = Auth.assert(Auth.isAuthor);

Auth.assertAdminOrSelf = Auth.assert(function (req) {
	return Auth.isAdmin(req) || Auth.isSelf(req);
});

Auth.assertAdminOrAuthor = Auth.assert(function (req) {
	return Auth.isAdmin(req) || Auth.isAuthor(req);
});

module.exports = Auth;