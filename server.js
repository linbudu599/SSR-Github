const koa = require("koa");
const next = require("next");
const Router = require("koa-router");

const chalk = require("chalk");
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

// 等待编译完成pages下所有页面
app.prepare().then(() => {
  const server = new koa();
  const router = new Router();
  server.use(async (ctx, next) => {
    // 这里处理的是node原生的req、res对象！
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(router.routes()).use(router.allowedMethods());

  server.listen(port, () => {
    console.log(chalk.green(`Koa Server Start on http://localhost:${port}`));
  });
});
