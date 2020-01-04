const getRedisSessionId = sid => {
  return `sess_id: ${sid}`;
};

class RedisSessionStore {
  constructor(client) {
    this.client = client;
  }

  // 获取redis中存储的session
  async get(sid) {
    console.log("get session_id: ", sid);
    const id = getRedisSessionId(sid);
    const data = await this.client.get(id);
    if (!data) {
      return null;
    }
    try {
      const result = JSON.parse(data);
      return result;
    } catch (err) {
      console.error(err);
    }
  }
  // 存储数据
  async set(sid, sess, ttl) {
    console.log("set session", sid);
    const id = getRedisSessionId(sid);
    if (typeof ttf === "number") {
      // 设置时以秒进行设置
      ttl = Math.ceil(ttl / 1000);
      try {
        const content = JSON.stringify(sess);
        if (ttl) {
          await this.client.setex(id, ttl, content);
        } else {
          await this.client.set(id, content);
        }
      } catch (err) {
        console.error(err);
      }
    }
    return id;
  }
  // 删除session
  async destroy(sid) {
    console.log("destory session", sid);
    const id = getRedisSessionId(sid);
    await this.client.del(id);
  }
}
module.exports = RedisSessionStore;
