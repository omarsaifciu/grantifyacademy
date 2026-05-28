const { connectRedis, getCache, setCache, deleteCache } = require('./services/redis');
require('dotenv').config();

const testRedis = async () => {
  console.log('🧪 Starting Redis test...\n');

  try {
    console.log('1️⃣ Connecting to Redis...');
    const client = await connectRedis();

    if (!client) {
      console.error('❌ Failed to connect to Redis');
      process.exit(1);
    }

    console.log('✅ Connected successfully!\n');

    console.log('2️⃣ Testing setCache...');
    const testData = { message: 'Hello Redis!', timestamp: new Date().toISOString() };
    const setResult = await setCache('test:key', testData, 60);
    console.log(`setCache result: ${setResult ? '✅ Success' : '❌ Failed'}\n`);

    console.log('3️⃣ Testing getCache...');
    const cachedData = await getCache('test:key');
    console.log(`getCache result: ${cachedData ? '✅ Success' : '❌ Failed'}`);
    if (cachedData) {
      console.log('   Data:', cachedData);
    }
    console.log('');

    console.log('4️⃣ Testing deleteCache...');
    const deleteResult = await deleteCache('test:key');
    console.log(`deleteCache result: ${deleteResult ? '✅ Success' : '❌ Failed'}\n`);

    console.log('5️⃣ Verifying deletion...');
    const deletedData = await getCache('test:key');
    console.log(`Data after deletion: ${deletedData ? '❌ Still exists' : '✅ Successfully deleted'}\n`);

    console.log('🎉 All tests passed! Redis is working perfectly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
};

testRedis();
