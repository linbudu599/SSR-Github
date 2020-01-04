const axios = require("axios");
const api = require("../lib/api");

const Index = () => {
  return <span>Index</span>;
};

Index.getInitialProps = async ({ ctx }) => {
  // const result = await axios
  //   // 如果在服务器中发送，会带上https://127.0.0.1:80
  //   // 需要分开处理服务端与客户端渲染
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
};

export default Index;
