var Stomp = require('stompjs');
var client = Stomp.overWS('http://localhost:15674/ws');

var headers = {
    login: 'usertest',
    passcode: 'test'
};

module.exports = {client, headers};