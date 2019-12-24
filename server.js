const koa = require("koa");
const next = require("next");
const Router = require("koa-router");

const session = require("koa-session");

const chalk = require("chalk");
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

let visitCount = 0;

// 等待编译完成pages下所有页面
app.prepare().then(() => {
  const server = new koa();
  const router = new Router();

  // 会被依次调用
  server.keys = ["sk1", "sk2", "sk3"];

  const SESSION_CONFIG = {
    key: "cookie_name"
    // 不设置store时会被直接存储到cookie中
    // store: {}
  };

  server.use(session(SESSION_CONFIG, server));
  // 实际上在这个中间件中进行了判断有无对应key的cookie，并生成一个session对象
  // 并 await next()
  // 在其他中间件处理完后，根据ctx.session内容是否有变化，通过cookies.set返回新的cookie

  router.get("/a/:id", async ctx => {
    const id = ctx.params.id;
    // await handle(ctx.req, ctx.res, {
    //   pathname: "/a",
    //   query: { id }
    // });
    await app.render(ctx.req, ctx.res, "/a", { id });
    // 代表不再使用koa内置的对body的处理，需要手动处理返回内容
    // 即在handle()中已经处理了
    // 如果不写，koa在处理完所有的中间件后会通过node的http模块再次返回内容

    ctx.respond = false;
  });
  // router.get("*", async ctx => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  // });

  // server.use(async (ctx, next) => {
  //   ctx.res.statusCode = 200;
  //   await next();
  // });

  server.use(async (ctx, next) => {
    // console.log(ctx.cookies.get("id"));
    // // 通过cookie的携带值获取用户信息

    // ctx.session = ctx.session || {};
    // ctx.session.user = {
    //   username: "Linbudu",
    //   age: "20"
    // };

    if (!ctx.session.user) {
      ctx.session.user = {
        username: "Linbudu",
        age: "20"
      };
    } else {
      console.log("session existed: " + ctx.session);
    }

    // 以上就把信息挂载到了ctx对象上
    await next();
  });

  server.use(router.routes());
  server.use(async (ctx, next) => {
    // 这里处理的是node原生的req、res对象！
    ctx.cookies.set("id", visitCount);
    visitCount++;
    console.log(visitCount);
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.listen(port, () => {
    console.log(chalk.green(`Koa Server Start on http://localhost:${port}`));
  });
});
