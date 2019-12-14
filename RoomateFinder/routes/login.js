module.exports = {
	getLoginPage: (req, res) => {
		// execute query
		res.render('login.ejs');
	}
};
