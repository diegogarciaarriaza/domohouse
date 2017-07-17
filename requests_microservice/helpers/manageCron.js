var cron = require('node-cron');

var crons = []; // create an empty array

var manageCron = function (idCron, accion){
    var task = cron.schedule('* * * * *', function() {
        console.log('immediately started');
    }, false);

    crons.push({
        key:   "keyName",
        value: task
    });

    switch (accion){
        case "start": {
            task.start();
        }
    }
}

module.exports = {manageCron, crons}

