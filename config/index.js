'use strict';

// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('dotenv').config({ path: `.env` });
const fs = require('fs')

module.exports = {
    port: process.env.PORT,
    tokenSecret: process.env.JWT_SECRET,
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_DATABASE,
        pool: process.env.DB_POOL_MAX,
        idle: process.env.DB_POOL_IDLE,
        timeout: process.env.DB_POOL_ACQUIRE
    },
    aut_server: process.env.AUTH_SERVER

}
