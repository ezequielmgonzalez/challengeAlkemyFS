const Pool = require("pg").Pool;

const pool = new Pool({
    user: "testuser",
    password: "pAssw0rd",
    host: "localhost",
    port: 5432,
    database: "budgetwisedb"
});

module.exports = pool;