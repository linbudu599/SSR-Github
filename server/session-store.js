const Redis = require("ioredis");
const { Store } = require("koa-session2");

class RedisStore extends Store {
  constructor() {
    super();
    this.redis = new Redis();
  }

  async get(sid, ctx) {
    let data = await this.redis.get(`SESSION:${sid}`);
    const content = JSON.parse(data);
    console.log(`get session SESSION:${sid}`);
    return content;
  }

  async set(
    session,
    { sid = this.getID(24), maxAge = 10000000000000 } = {},
    ctx
  ) {
    console.log(`set session ${JSON.stringify(session)}`);
    try {
      await this.redis.set(
        `SESSION:${sid}`,
        JSON.stringify(session),
        "EX",
        maxAge / 1000
      );
    } catch (e) {
      console.error(e);
    }
    return sid;
  }

  async destroy(sid, ctx) {
    console.log(`delete session SESSION:${sid}`);

    return await this.redis.del(`SESSION:${sid}`);
  }
}

module.exports = RedisStore;
