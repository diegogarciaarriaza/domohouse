'use strict'

var app = require('./app');
var port = 3702;

app.listen(port, function(){
    console.log("Server running at port " + port);
});
