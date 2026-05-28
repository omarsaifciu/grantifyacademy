const express = require('express');
const Redis = require('ioredis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Redis client instance
let redisClient = null;
let redisReady = false;

// Redis retry strategy
const retryStrategy = (times) => {
  const delay = Math.min(times * 50, 2000);
  console.log(`🔄 Redis reconnecting in ${delay}ms... (attempt ${times})`);
  return delay;
};

// Initialize Redis connection
const initRedis = async () => {
  try {
    // Use individual config first (avoids URL encoding issues), then REDIS_URL
    let client;
    
    if (process.env.REDIS_HOST) {
      const redisConfig = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB) || 0,
        retryStrategy,
        enableReadyCheck: true,
      };

      // Filter out undefined values
      Object.keys(redisConfig).forEach(key => 
        redisConfig[key] === undefined && delete redisConfig[key]
      );

      console.log('🔄 Connecting to Redis with config:', {
        host: redisConfig.host,
        port: redisConfig.port,
        username: redisConfig.username,
        password: redisConfig.password ? '***' : undefined,
      });

      client = new Redis(redisConfig);
    } else if (process.env.REDIS_URL) {
      console.log('🔄 Connecting to Redis using REDIS_URL');
      client = new Redis(process.env.REDIS_URL, {
        retryStrategy,
        enableReadyCheck: true,
      });
    } else {
      console.log('🔄 Connecting to local Redis');
      client = new Redis({
        retryStrategy,
        enableReadyCheck: true,
      });
    }

    // Event handlers
    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    client.on('ready', () => {
      console.log('✅ Redis ready for operations');
      redisReady = true;
    });

    client.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
      redisReady = false;
    });

    client.on('close', () => {
      console.log('⚠️ Redis connection closed');
      redisReady = false;
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
      redisReady = false;
    });

    redisClient = client;
    return client;
  } catch (err) {
    console.error('❌ Failed to initialize Redis client:', err.message);
    redisReady = false;
    return null;
  }
};

// Middleware to check Redis availability
const redisCheckMiddleware = (req, res, next) => {
  if (!redisReady || !redisClient) {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Redis is not connected. Please try again later.',
    });
  }
  next();
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Initiating graceful shutdown...`);

  if (redisClient) {
    console.log('🔌 Closing Redis connection...');
    await redisClient.quit();
    console.log('✅ Redis connection closed safely');
  }

  process.exit(0);
};

// Initialize application
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');

    // Initialize Redis first
    await initRedis();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Redis check middleware for all API routes
    app.use('/api', redisCheckMiddleware);

    // Example health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        redis: redisReady ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      });
    });

    // API endpoints
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Cache keys
    const CACHE_KEYS = {
      UNIVERSITIES: 'universities:all',
      SCHOLARSHIPS: 'scholarships:all',
      BLOG_POSTS: 'blog_posts:all',
      UNIVERSITY: (id) => `university:${id}`,
      SCHOLARSHIP: (id) => `scholarship:${id}`,
      BLOG_POST: (id) => `blog_post:${id}`,
    };
    
    const getCache = async (key) => {
      if (!redisReady || !redisClient) return null;
      try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.error('❌ Redis get error:', err.message);
        return null;
      }
    };
    
    const setCache = async (key, value, ttl = process.env.REDIS_CACHE_TTL || process.env.CACHE_TTL || 300) => {
      if (!redisReady || !redisClient) return false;
      try {
        await redisClient.setex(key, ttl, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error('❌ Redis set error:', err.message);
        return false;
      }
    };
    
    const deleteCache = async (key) => {
      if (!redisReady || !redisClient) return false;
      try {
        await redisClient.del(key);
        return true;
      } catch (err) {
        console.error('❌ Redis delete error:', err.message);
        return false;
      }
    };
    
    // API routes
    app.get('/api/universities', async (req, res) => {
      try {
        const cached = await getCache(CACHE_KEYS.UNIVERSITIES);
        if (cached) {
          console.log('📦 Using cached universities');
          return res.json(cached);
        }

        const { data } = await supabase.from('universities').select('*').order('name', { ascending: true });
        const universities = data ?? [];
        
        await setCache(CACHE_KEYS.UNIVERSITIES, universities);
        res.json(universities);
      } catch (error) {
        console.error('❌ Error fetching universities:', error);
        res.status(500).json({ error: 'Failed to fetch universities' });
      }
    });

    app.get('/api/universities/:id', async (req, res) => {
      try {
        const key = CACHE_KEYS.UNIVERSITY(req.params.id);
        const cached = await getCache(key);
        if (cached) {
          console.log(`📦 Using cached university ${req.params.id}`);
          return res.json(cached);
        }

        const { data } = await supabase.from('universities').select('*').eq('id', req.params.id).single();
        const university = data ?? null;
        
        if (university) {
          await setCache(key, university);
        }
        res.json(university);
      } catch (error) {
        console.error('❌ Error fetching university:', error);
        res.status(500).json({ error: 'Failed to fetch university' });
      }
    });

    app.post('/api/universities', async (req, res) => {
      try {
        const allow = ((u) => ({ name: u.name, location: u.location, students: u.students, image: u.image, description: u.description, programs: u.programs }));
        const { data } = await supabase.from('universities').insert(allow(req.body)).select().single();
        
        await deleteCache(CACHE_KEYS.UNIVERSITIES);
        res.json(data);
      } catch (error) {
        console.error('❌ Error creating university:', error);
        res.status(500).json({ error: 'Failed to create university' });
      }
    });

    app.put('/api/universities/:id', async (req, res) => {
      try {
        const allow = ((u) => ({ name: u.name, location: u.location, students: u.students, image: u.image, description: u.description, programs: u.programs }));
        const { data } = await supabase.from('universities').update(allow(req.body)).eq('id', req.params.id).select().single();
        
        await deleteCache(CACHE_KEYS.UNIVERSITIES);
        await deleteCache(CACHE_KEYS.UNIVERSITY(req.params.id));
        res.json(data);
      } catch (error) {
        console.error('❌ Error updating university:', error);
        res.status(500).json({ error: 'Failed to update university' });
      }
    });

    app.delete('/api/universities/:id', async (req, res) => {
      try {
        await supabase.from('universities').delete().eq('id', req.params.id);
        
        await deleteCache(CACHE_KEYS.UNIVERSITIES);
        await deleteCache(CACHE_KEYS.UNIVERSITY(req.params.id));
        res.status(204).send();
      } catch (error) {
        console.error('❌ Error deleting university:', error);
        res.status(500).json({ error: 'Failed to delete university' });
      }
    });

    app.get('/api/scholarships', async (req, res) => {
      try {
        const cached = await getCache(CACHE_KEYS.SCHOLARSHIPS);
        if (cached) {
          console.log('📦 Using cached scholarships');
          return res.json(cached);
        }

        const { data } = await supabase.from('scholarships').select('*').order('deadline', { ascending: true });
        const scholarships = data ?? [];
        
        await setCache(CACHE_KEYS.SCHOLARSHIPS, scholarships);
        res.json(scholarships);
      } catch (error) {
        console.error('❌ Error fetching scholarships:', error);
        res.status(500).json({ error: 'Failed to fetch scholarships' });
      }
    });

    app.get('/api/scholarships/:id', async (req, res) => {
      try {
        const key = CACHE_KEYS.SCHOLARSHIP(req.params.id);
        const cached = await getCache(key);
        if (cached) {
          console.log(`📦 Using cached scholarship ${req.params.id}`);
          return res.json(cached);
        }

        const { data } = await supabase.from('scholarships').select('*').eq('id', req.params.id).single();
        const scholarship = data ?? null;
        
        if (scholarship) {
          await setCache(key, scholarship);
        }
        res.json(scholarship);
      } catch (error) {
        console.error('❌ Error fetching scholarship:', error);
        res.status(500).json({ error: 'Failed to fetch scholarship' });
      }
    });

    app.post('/api/scholarships', async (req, res) => {
      try {
        const allow = ((s) => ({ title: s.title, type: s.type, university: s.university, value: s.value, deadline: s.deadline, image: s.image, description: s.description, requirements: s.requirements }));
        const { data } = await supabase.from('scholarships').insert(allow(req.body)).select().single();
        
        await deleteCache(CACHE_KEYS.SCHOLARSHIPS);
        res.json(data);
      } catch (error) {
        console.error('❌ Error creating scholarship:', error);
        res.status(500).json({ error: 'Failed to create scholarship' });
      }
    });

    app.put('/api/scholarships/:id', async (req, res) => {
      try {
        const allow = ((s) => ({ title: s.title, type: s.type, university: s.university, value: s.value, deadline: s.deadline, image: s.image, description: s.description, requirements: s.requirements }));
        const { data } = await supabase.from('scholarships').update(allow(req.body)).eq('id', req.params.id).select().single();
        
        await deleteCache(CACHE_KEYS.SCHOLARSHIPS);
        await deleteCache(CACHE_KEYS.SCHOLARSHIP(req.params.id));
        res.json(data);
      } catch (error) {
        console.error('❌ Error updating scholarship:', error);
        res.status(500).json({ error: 'Failed to update scholarship' });
      }
    });

    app.delete('/api/scholarships/:id', async (req, res) => {
      try {
        await supabase.from('scholarships').delete().eq('id', req.params.id);
        
        await deleteCache(CACHE_KEYS.SCHOLARSHIPS);
        await deleteCache(CACHE_KEYS.SCHOLARSHIP(req.params.id));
        res.status(204).send();
      } catch (error) {
        console.error('❌ Error deleting scholarship:', error);
        res.status(500).json({ error: 'Failed to delete scholarship' });
      }
    });

    app.get('/api/blog-posts', async (req, res) => {
      try {
        const cached = await getCache(CACHE_KEYS.BLOG_POSTS);
        if (cached) {
          console.log('📦 Using cached blog posts');
          return res.json(cached);
        }

        const { data } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
        const posts = data ?? [];
        
        await setCache(CACHE_KEYS.BLOG_POSTS, posts);
        res.json(posts);
      } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
      }
    });

    app.get('/api/blog-posts/:id', async (req, res) => {
      try {
        const key = CACHE_KEYS.BLOG_POST(req.params.id);
        const cached = await getCache(key);
        if (cached) {
          console.log(`📦 Using cached blog post ${req.params.id}`);
          return res.json(cached);
        }

        const { data } = await supabase.from('blog_posts').select('*').eq('id', req.params.id).single();
        const post = data ?? null;
        
        if (post) {
          await setCache(key, post);
        }
        res.json(post);
      } catch (error) {
        console.error('❌ Error fetching blog post:', error);
        res.status(500).json({ error: 'Failed to fetch blog post' });
      }
    });

    app.post('/api/blog-posts', async (req, res) => {
      try {
        const allow = ((p) => ({ title: p.title, excerpt: p.excerpt, author: p.author, date: p.date, image: p.image, content: p.content }));
        const { data } = await supabase.from('blog_posts').insert(allow(req.body)).select().single();
        
        await deleteCache(CACHE_KEYS.BLOG_POSTS);
        res.json(data);
      } catch (error) {
        console.error('❌ Error creating blog post:', error);
        res.status(500).json({ error: 'Failed to create blog post' });
      }
    });

    app.put('/api/blog-posts/:id', async (req, res) => {
      try {
        const allow = ((p) => ({ title: p.title, excerpt: p.excerpt, author: p.author, date: p.date, image: p.image, content: p.content }));
        const { data } = await supabase.from('blog_posts').update(allow(req.body)).eq('id', req.params.id).select().single();
        
        await deleteCache(CACHE_KEYS.BLOG_POSTS);
        await deleteCache(CACHE_KEYS.BLOG_POST(req.params.id));
        res.json(data);
      } catch (error) {
        console.error('❌ Error updating blog post:', error);
        res.status(500).json({ error: 'Failed to update blog post' });
      }
    });

    app.delete('/api/blog-posts/:id', async (req, res) => {
      try {
        await supabase.from('blog_posts').delete().eq('id', req.params.id);
        
        await deleteCache(CACHE_KEYS.BLOG_POSTS);
        await deleteCache(CACHE_KEYS.BLOG_POST(req.params.id));
        res.status(204).send();
      } catch (error) {
        console.error('❌ Error deleting blog post:', error);
        res.status(500).json({ error: 'Failed to delete blog post' });
      }
    });

    app.get('/api/users', async (req, res) => {
      try {
        const { data } = await supabase.from('users').select('*').order('email', { ascending: true });
        res.json(data ?? []);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    });

    app.post('/api/users', async (req, res) => {
      try {
        const { data } = await supabase.from('users').insert(req.body).select().single();
        res.json(data);
      } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
      }
    });

    app.put('/api/users/:id', async (req, res) => {
      try {
        const { data } = await supabase.from('users').update(req.body).eq('id', req.params.id).select().single();
        res.json(data);
      } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
      }
    });

    app.delete('/api/users/:id', async (req, res) => {
      try {
        await supabase.from('users').delete().eq('id', req.params.id);
        res.status(204).send();
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
      }
    });

    app.get('/api/settings', async (req, res) => {
      try {
        const { data } = await supabase.from('settings').select('*').eq('id', 'site').single();
        res.json(data ?? {});
      } catch (error) {
        console.error('❌ Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
      }
    });

    app.put('/api/settings', async (req, res) => {
      try {
        const { data } = await supabase
          .from('settings')
          .upsert({ id: 'site', ...req.body }, { onConflict: 'id' })
          .select()
          .single();
        res.json(data);
      } catch (error) {
        console.error('❌ Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
      }
    });

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();
