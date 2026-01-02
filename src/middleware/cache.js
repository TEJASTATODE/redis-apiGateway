const redis = require("../config/redis");
const cacheUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;

    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      console.log("⚡ CACHE HIT");
      return res.status(200).json(JSON.parse(cachedUser));
    }


    console.log("🐢 CACHE MISS");
    next();
  } catch (error) {
    console.error("Redis cache error:", error);
    next();
  }
};

module.exports = cacheUser;
