const { createClient } = require('redis');

module.exports.redisSetup = (async () => {
  // Connect to your internal Redis instance using the REDIS_URL environment variable
  // The REDIS_URL is set to the internal Redis URL e.g. redis://red-343245ndffg023:6379
    const client = createClient({
    url: process.env.REDIS_URL
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

})();