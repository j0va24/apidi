var express = require('express'); var path = require('path'); var cookieParser = require('cookie-parser');
var logger = require('morgan'); var bodyParser = require('body-parser'); var mongoose = require('mongoose');
var indexRouter = require('./routes/index'); var userRouter = require('./routes/user');
var productsRouter = require('./routes/products'); var ordersRouter = require('./routes/orders');
var app = express();

// Database Conection
mongoose.connect('mongodb+srv://janoj24:xDRhMud0rGI4iOX2@cluster0-llswd.mongodb.net/test?retryWrites=true&w=majority', 
                { useNewUrlParser: true, useUnifiedTopology: true });

// Middlewar's
app.use(logger('dev')); app.use(express.json()); app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); app.use(cookieParser()); app.use(express.static(path.join(__dirname, 'public')));
app.use ((req, res, next) => { res.header('Access-Control-Allow-Origin', '*');  
                               res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Autorization');
                               if ( req.method === 'OPTIONS' ) { res.header('Access-Control-Allow-Methods', 'PUT, DELETE, PATCH, GET, POST'); 
                               return res.status(200).json({});} next(); });
                               
// Routes
app.use('/', indexRouter); app.use('/user', userRouter);
app.use('/products', productsRouter); app.use('/orders', ordersRouter);

module.exports = app;
