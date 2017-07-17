'use strict'

var app = require('./app');
var port = 3703;

app.listen(port, function(){
    console.log("Server running at port " + port);
});