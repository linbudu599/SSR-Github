const withCss = require("@zeit/next-css");

if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

// 产生一个配置项
module.exports = withCss({});
