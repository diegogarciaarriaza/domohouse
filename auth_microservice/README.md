# My project's README

## 1- Obtención de modelos directamente desde la base de datos en mariasb/mysql usando sequelize-auto

### Requisitos previos

```
npm install sequelize --save
npm install -g mysql --save
```

### Instalación

```
npm install -g sequelize-auto --save
```

### Uso

```
[node] sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName1, tableName2, etc] -C

Options:
  -h, --host        IP/Hostname for the database.   [required]
  -d, --database    Database name.                  [required]
  -u, --user        Username for database.
  -x, --pass        Password for database.
  -p, --port        Port number for database.
  -c, --config      JSON file for Sequelize's constructor "options" flag object as defined here: https://sequelize.readthedocs.org/en/latest/api/sequelize/
  -o, --output      What directory to place the models.
  -e, --dialect     The dialect/engine that you're using: postgres, mysql, sqlite
  -a, --additional  Path to a json file containing model definitions (for all tables) which are to be defined within a model's configuration parameter. For more info: https://sequelize.readthedocs.org/en/latest/docs/models-definition/#configuration
  -t, --tables      Comma-separated names of tables to import
  -T, --skip-tables Comma-separated names of tables to skip
  -C, --camel       Use camel case to name models and fields
  -n, --no-write    Prevent writing the models to disk.
  -s, --schema      Database schema from which to retrieve tables
```

#### Nota importante!

- La contraseña debe ir entre comillas simples!

## 2- Import de modelos autogenerados con sequelize-auto

### Conexión a base de datos y obtención de entidades/modelos

Una vez que tenemos los modelos generados en la carpeta ./models, generaremos un fichero index.js con el contenido siguiente

```
var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'user', 'password', {
    host: 'host/ip',
    dialect: 'mariadb' | 'mysql' | 'other',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

var models = require('sequelize-auto-import')(sequelize, './PATH/TO/MODELS/');

module.exports = models;
```
### Obtención de los modelos/entidades generados

Desde donde necesitemos el acceso a dichso modelos (por ejemplo desde un controlador)

```
var models = require('./../models/index');
```

Ahora simplemente accederemos a cada modelo mediante 

```
var usuarios = models.usuarios;
```

## 3- API

```
//Register users
post('/register');
```

```
//authenticate the new user and get a JWT
post('/authenticate');
```

```
//protect dashboard route with JWT
get('/dashboard');
```