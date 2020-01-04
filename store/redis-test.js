(async () => {
  const Redis = require("ioredis");

  const redis = new Redis({
    port: 6379,
    host: "localhost"
    // password: "linbudu"
  });
  await redis.set("c", "from node.js");
  await redis.setex("d", 10, "expire from node.js");
  const keys = await redis.keys("*");
  console.log(keys);
  const spKey = await redis.get("d");
  console.log(spKey);
})();
