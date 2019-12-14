module.exports = {
    getUserHomePage: (req, res) => {
        // execute query
        res.render('homepage.ejs');
    },
};