import { useEffect } from "react";
const axios = require("axios");
const api = require("../lib/api");

const Index = () => {
  useEffect(() => {
    axios.post("/github/test", { test: "test-value" });
  });
  return <span>Index</span>;
};

// 客户端页面跳转时会调用，同时如果服务端渲染时访问index页面也会调用
// ssr时处于nodejs环境
Index.getInitialProps = async ({ ctx }) => {
  // const result = await axios
  //   .get("/github/search/repositories?q=react")
  //   .then(res => {
  //     console.log(res);
  //   });

  // return {
  //   data: result.data
  // };

  // req与res只有在ssr时有
  const result = await api.request(
    {
      url: "/search/repositories?q=react"
    },
    ctx.req,
    ctx.res
  );

  return { data: result.data };
};

export default Index;
