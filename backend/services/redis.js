const Redis = require('ioredis');
require('dotenv').config();

let redisClient = null;
let isConnected = false;

const connectRedis = async () => {
  try {
    let redisClientInstance;
    
    // Use individual config variables first (avoids URL encoding issues)
    if (process.env.REDIS_HOST) {
      const redisConfig = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB) || 0,
      };

      // Filter out undefined values
      Object.keys(redisConfig).forEach(key => redisConfig[key] === undefined && delete redisConfig[key]);

      console.log('🔄 Connecting to Redis with config:', {
        host: redisConfig.host,
        port: redisConfig.port,
        username: redisConfig.username,
        password: redisConfig.password ? '***' : undefined
      });

      redisClientInstance = new Redis(redisConfig);
    } else if (process.env.REDIS_URL) {
      console.log('🔄 Connecting to Redis using REDIS_URL');
      redisClientInstance = new Redis(process.env.REDIS_URL);
    } else {
      console.log('🔄 Connecting to local Redis');
      redisClientInstance = new Redis();
    }

    redisClient = redisClientInstance;

    // Wait for the connection to be established
    await new Promise((resolve, reject) => {
      redisClient.on('connect', () => {
        console.log('✅ Connected to Redis successfully');
        isConnected = true;
        resolve();
      });

      redisClient.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        isConnected = false;
        reject(err);
      });

      redisClient.on('close', () => {
        console.log('⚠️ Redis connection closed');
        isConnected = false;
      });
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

const setCache = async (key, value, ttl = process.env.REDIS_CACHE_TTL || process.env.CACHE_TTL || 300) => {
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
