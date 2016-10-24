var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'Node Application'
        },
        port: 3000,
        db: {
            database: "node_application",
            user: "root",
            password: "password123",
            options: {
                host: 'localhost',
                dialect: 'mysql',

                pool: {
                    max: 100,
                    min: 0,
                    idle: 10000
                }
            }
        }
    }
};

module.exports = config[env];

