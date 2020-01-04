const koa = require("koa");
const next = require("next");
const Router = require("koa-router");

const session = require("koa-session2");

const chalk = require("chalk");
const port = process.env.PORT || 3000;

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

const auth = require("./auth");
const api = require("./api");

const RedisSessionStore = require("./session-store");

// let visitCount = 0;

// 传入配置创建redis客户端
// const redis = new Redis();

// 等待编译完成pages下所有页面
app.prepare().then(() => {
  const server = new koa();
  const router = new Router();

  // 会被依次调用
  server.keys = ["keyyyyyy"];

  const SESSION_CONFIG = {
    key: "test_cookie_name",
    signed: true,
    maxAge: 86400000,
    // 不设置store时会被直接存储到cookie中
    // store: new RedisSessionStore(redis)
    store: new RedisSessionStore()
  };

  server.use(session(SESSION_CONFIG));
  // 实际上在这个中间件中进行了判断有无对应key的cookie（cookies.get()），，如果有会生成一个session对象
  // 并 await next()
  // 在其他中间件处理完后，根据ctx.session内容是否有变化，通过cookies.set返回新的cookie

  // 报错cannot set ...after they are sent to clent
  // 在全局中间件中已经handle了，即请求已经被回传给客户端，session中间件还继续写cookie

  // 处理github oauth登陆
  auth(server);
  api(server);

  router.get("/a/:id", async ctx => {
    const id = ctx.params.id;
    await handle(ctx.req, ctx.res, {
      pathname: "/a",
      query: { id }
    });
    ctx.respond = false;
    // 代表不再使用koa内置的对body的处理，需要手动处理返回内容
    // 即在handle()中已经处理了body内容
    // 如果不写，koa在处理完所有的中间件后会通过node的http模块再次返回内容
  });

  router.get("/api/user/info", async ctx => {
    const user = ctx.session.userInfo;

    if (!user) {
      ctx.status = 401;
      ctx.body = "Need Login";
    } else {
      ctx.set("Content-Type", "application/json");
      ctx.body = user;
    }
  });

  server.use(async (ctx, next) => {
    // console.log(ctx.cookies.get("id"));
    // // 通过cookie的携带值获取用户信息

    await next();
  });

  router.get("/set", async ctx => {
    ctx.session.user = {
      name: "linbudu_session",
      age: "21"
    };
    ctx.body = "set session success";
  });

  router.get("/del", async ctx => {
    ctx.session = null;
    ctx.body = "delete session success";
  });

  server.use(router.routes());

  // 全局中间件
  server.use(async (ctx, next) => {
    // 这里处理的是node原生的req、res对象！
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.listen(port, () => {
    console.log(chalk.green(`Koa Server Start on http://localhost:${port}`));
  });
});
