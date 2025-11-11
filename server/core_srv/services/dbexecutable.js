const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'vMySql@1124#390',
  database: 'augmount_db',
  waitForConnections: false,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0
}

const mysqlPoolConnection = mysql.createPool(dbConfig);

module.exports.dbExecutableQuery = async (query, params) => {
  try {
    const [results] = await mysqlPoolConnection.execute(query, params);
    return results;
  } catch (err) {
    throw err;
  }
}


module.exports.dbtranQuery = async (query, params) => {
  const connection = await mysqlPoolConnection.getConnection();
  try {
    connection.beginTransaction();
    const [results] = await connection.query(
      query,
      params
    );
    connection.commit();
    return results;
  } catch (err) {
    console.log(err)
    await connection.rollback();
    throw err;
  }
}

