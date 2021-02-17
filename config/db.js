var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
var auth = require('./auth')

mongoose
    .connect(auth.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connected to the database")
    })
    .catch(err => {
        console.log("error", err);
        process.exit();
    })
