var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ecommerce-node', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', ()=> {
    console.log('db not connected');
    setTimeout(() => {
        mongoose.connect('mongodb://localhost:27017/ecommerce-node', { useNewUrlParser: true });
    }, 2000)

})
db.on('open', () => {
    console.log('db connected');
})

app.use('/api/v1/product', require('./routes/product-route'));
app.use('/api/v1/cart', require('./routes/cart-route'));

let listener = app.listen(8000, () => {
    console.log(`server is listening on port =>> ${listener.address().port}`);
})