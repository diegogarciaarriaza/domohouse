module.exports = {
    'secret': 'asdoi_.asdas+as023np23>1231',
    'domohouse': { //mariadb
        'database': 'domohouse',
        'user': 'root',
        //'pass': '$ev1Za010',
        'pass': '',
        //'host': '172.18.74.198',
        'host': '127.0.0.1',
        'port': '3306',
        'dialect': 'mariadb'
    },
    'domohousemongo' :{ //mongo
        'database': 'errores',
        'table': 'errores',
        'host': 'localhost'
    },
    'schedule': {
        'host': 'localhost',
        'port': '3706'
    }
};
