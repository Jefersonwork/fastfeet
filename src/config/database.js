module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'festfeet_data',
  define: {
    timestamp: true,
    underscored: true,
    underscoreAll: true,
  },
};
