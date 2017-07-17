'use strict'

var app = require('./app');
var port = 3707;

app.listen(port, function(){
    console.log("Server running at port " + port);
});