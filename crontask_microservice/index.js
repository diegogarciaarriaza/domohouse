'use strict'

var app = require('./app');
var port = 3705;

app.listen(port, function(){
    console.log("Server running at port " + port);
});