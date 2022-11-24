var express = require('express');
const whatsappRoutes = require('./api/routes/whatsapp');

var app = express();

//Application Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});

//Routes
app.use('/whatsapp', whatsappRoutes);

module.exports = app;