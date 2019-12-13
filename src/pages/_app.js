// 重写默认的app.js
import App from "next/app";
// 会引入全部的CSS，但同样能够异步分模块加载
import "antd/dist/antd.css";

export default App;
