var mysql = require('mysql');

var TEST_DATABASE = 'qdm203823661_db';

var pool = mysql.createPool({
    host: 'qdm203823661.my3w.com',
    user: 'qdm203823661',
    password: 'liguanjian',
    database: TEST_DATABASE,
    dateStrings: true,
    multipleStatements: false,
    insecureAuth: true
});

var query = function (sql, paras, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, paras, function (error, results, fields) {
                conn.release();
                callback(error, results, fields);
            });
        }
    });
};

exports.query = query;
exports.pool = pool;
