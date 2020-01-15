const withCss = require("@zeit/next-css");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const { ANALYZE } = process.env;
const oauthConfig = require("./config.js");

if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

const configs = {
  // 编译文件输出目录(.next)
  distDir: ".next",
  // 是否为每个路由生成Etag，用于进行缓存验证，
  // 即两次请求同一个界面时发现是同一个ETag就会不再次返回页面
  // nginx也有类似的功能，所以可能会把这里的关闭掉
  generateEtags: true,
  // 页面内容缓存配置
  onDemandEntries: {
    // 内容在内存中缓存时长
    maxInactiveAge: 25 * 1000,
    // 同时缓存的页面数量
    pagesBufferLength: 2
  },
  // 在pages目录下会被认为是页面组件的文件后缀
  pagesExtension: ["js", "jsx"],
  // 配置buildID
  //Next.js 使用构建时生成的常量来标识你的应用服务是哪个版本。在每台服务器上运行构建命令时，
  // 可能会导致多服务器部署出现问题。为了保持同一个构建 ID，可以配置generateBuildId函数：
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID;
    }
    // null代表使用默认unique id
    return null;
  },
  // 手动修改webpack及dev-server中间件 config
  // webpack方法将被执行两次，一次在服务端一次在客户端。
  // 可以用isServer属性区分客户端和服务端来配置
  // buildId - 字符串类型，构建的唯一标示
  // dev - Boolean型，判断你是否在开发环境下
  // isServer - Boolean 型，为true使用在服务端, 为false使用在客户端.
  // defaultLoaders - 对象型 ，内部加载器, 你可以如下配置
  //   babel - 对象型，配置babel-loader.
  //   hotSelfAccept - 对象型， hot-self-accept-loader配置选项.
  //   这个加载器只能用于高阶案例。如 @zeit/next-typescript添加顶层 typescript 页面。
  webpack(config, { isServer }) {
    if (ANALYZE) {
      // plugins/module/...，就像webpack配置一样
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true
        })
      );
    }
    return config;
  },
  webpackDevMiddleware: config => {
    return config;
  },
  // 在页面中可以使用process.env.customVal
  env: {
    customVal: "linbudu"
  },
  // 下面两个运行时配置需要通过"next/config"来读取
  // 只有在服务端渲染时会获取的配置
  serverRuntimeConfig: {
    mySecret: "linbudu-secret",
    nodeSecret: process.env.SECRET
  },
  // 服务端与客户端都可以获取的配置
  publicRuntimeConfig: {
    staticFolder: "/static"
  }
};

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const SCOPE = "user";
const { client_id, client_secret } = oauthConfig.github;
// 产生一个配置项,使用Object.assign
module.exports = withBundleAnalyzer(
  withCss({
    webpack(config) {
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
      return config;
    },
    env: {
      customVal: "linbudu"
    },
    serverRuntimeConfig: {
      mySecret: "linbudu-secret",
      nodeSecret: process.env.SECRET
    },
    publicRuntimeConfig: {
      staticFolder: "/static",
      GITHUB_OAUTH_URL,
      OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
    },
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    BundleAnalyzerConfig: {
      server: {
        mode: "static",
        reportFileName: "../bundle/server/server.html"
      },
      browser: {
        mode: "static",
        reportFileName: "../bundle/server/client.html"
      }
    }
  })
);
