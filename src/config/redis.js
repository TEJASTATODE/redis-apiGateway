const {createClient} = require('redis');
const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});
redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Failed to connect Redis:", error);
  }
})();
module.exports = redisClient;