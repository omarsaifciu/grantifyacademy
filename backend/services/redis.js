const Redis = require('ioredis');
require('dotenv').config();

let redisClient = null;
let isConnected = false;

const connectRedis = async () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL);

    redisClient.on('connect', () => {
      console.log('✅ Connected to Redis successfully');
      isConnected = true;
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
      isConnected = false;
    });

    redisClient.on('close', () => {
      console.log('⚠️ Redis connection closed');
      isConnected = false;
    });

    return redisClient;
  } catch (err) {
    console.error('❌ Failed to initialize Redis client:', err.message);
    isConnected = false;
    return null;
  }
};

const getCache = async (key) => {
  if (!isConnected || !redisClient) {
    return null;
  }
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('❌ Redis get error:', err.message);
    return null;
  }
};

const setCache = async (key, value, ttl = process.env.CACHE_TTL || 300) => {
  if (!isConnected || !redisClient) {
    return false;
  }
  try {
    await redisClient.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('❌ Redis set error:', err.message);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!isConnected || !redisClient) {
    return false;
  }
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.error('❌ Redis delete error:', err.message);
    return false;
  }
};

const deleteCachePattern = async (pattern) => {
  if (!isConnected || !redisClient) {
    return false;
  }
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (err) {
    console.error('❌ Redis delete pattern error:', err.message);
    return false;
  }
};

module.exports = {
  connectRedis,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern
};
