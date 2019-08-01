var indexController = require('../controllers/indexController');

module.exports = function(app,express){

    //links routes and functions
    app.get('/app/getTweets',indexController.GetTweets);
    app.get('/app/getTopByUser',indexController.GetTopByUser);
    app.get('/app/getTopUser',indexController.GetTopUser);    
    app.get('/app/getTweetsOverTime',indexController.GetTweetOverTime);    
}
