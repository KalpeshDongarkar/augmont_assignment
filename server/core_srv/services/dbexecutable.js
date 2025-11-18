const mysql2 = require('mysql2/promise');
const mysql = require("mysql");
const fs = require("fs");

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

const mysql2PoolConnection = mysql2.createPool(dbConfig);
const mysqlPoolConnection = mysql.createPool(dbConfig);


module.exports.dbExecutableQuery = async (query, params) => {
  try {
    const [results] = await mysql2PoolConnection.query(query, params);
    return results;
  } catch (err) {
    throw err;
  }
}

module.exports.dbQueryStream = async (query, filepath, batchSize = 5000) => {
  const output = fs.createWriteStream(filepath);
  let offset = 0;
  let rowsFetched = 0;
  let hdrsKeys = []

  const waitForFinish = new Promise((resolve, reject) => {

    output.on('finish', async () => {
      const buffer = fs.readFileSync(filepath);
      resolve(buffer)
    });
    output.on('error', reject);
  });

  try {
    do {
      const batchQuery = `${query} LIMIT ${batchSize} OFFSET ${offset}`;
      const [rows] = await mysql2PoolConnection.execute(batchQuery);
      if (rows != 0 && offset == 0) {
        hdrsKeys = Object.keys(rows[0])
        output.write(hdrsKeys.join(',') + '\n');
      }
      if (rows.length === 0) break;

      rows.forEach(row => {
        const csvLine = hdrsKeys.map(key => row[key]).join(',');
        output.write(csvLine + '\n');
      });

      rowsFetched += rows.length;
      offset += batchSize;

    } while (true);
    output.end();
    return await waitForFinish;
  } catch (err) {
    throw err;
  }
}

module.exports.dbtranQuery = async (query, params) => {
  const connection = await mysql2PoolConnection.getConnection();
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

