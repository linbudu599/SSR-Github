const koa = require("koa");
const next = require("next");
const Router = require("koa-router");

const chalk = require("chalk");
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

// 等待编译完成pages下所有页面
// app.prepare().then(() => {
const server = new koa();
const router = new Router();
//   server.use(async (ctx, next) => {
//     await handle(ctx.req, ctx.res);
//     ctx.respond = false;
// });

// 一个简单的koa中间件例子
// ctx会一层层按照顺序流经koa的各个中间件
server.use(async (ctx, next) => {
  ctx.state.midState = "中间件挂载数据";
  await next();
});

// :id & ctx.params.id 这种写法是来自koa-router的支持
// 原生（GET,POST需要bodyparser中间件）：
// let req_query = request.query;
// let req_querystring = request.querystring;
router.get("/:id", async ctx => {
  const state = ctx.state.midState;
  const id = ctx.params.id;
  ctx.body = { state, id };
});

server.use(router.routes()).use(router.allowedMethods());

server.listen(port, () => {
  console.log(chalk.green(`Koa Server Start on http://localhost:${port}`));
});
// });
