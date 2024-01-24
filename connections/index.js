const { Pool} = require('pg')

const dbPool = new Pool({
  user: 'postgres',
  database: 'db_personalweb',
  password: 'Lavesfar123',
  port: 5432
})

module.exports = dbPool