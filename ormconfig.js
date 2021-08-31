module.exports = {
   "type": process.env.DB_TYPE,
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USERNAME,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": false,
   "entities": ["dist/**/*.entity.js"],
   "migrations": [
      "dist/shared/migrations/*.js"
  ],
  migrationsRun: false,
   "cli": {
      "migrationsDir": "src/db/migration"
   }
}