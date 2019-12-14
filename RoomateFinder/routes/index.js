module.exports = {
    getHomePage: (req, res) => {
        // execute query
        res.render('index.ejs');
    },
};