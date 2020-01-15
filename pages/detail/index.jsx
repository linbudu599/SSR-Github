import React from "react";
import dynamic from "next/dynamic";
import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";

// 注意得是个方法，否则会自动执行
const MDRender = dynamic(() => import("../../components/MarkdownRenderer"), {
  loading: () => <p>Loading...</p>
});

export const Detail = ({ readme }) => {
  return <MDRender content={readme.content} isBase64={true} />;
};

Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res
  }
}) => {
  const readme = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`
    },
    req,
    res
  );
  // 拿到的数据中是base64编码的markdown文本，
  // 需要使用 atob() 方法进行解码再转义为html
  // 但是这个方法只有在window中有即csr，而服务端node并没有

  // 解决方法： 为node全局增加这个方法
  return {
    readme: readme.data
  };
};

export default withRepoBasic(Detail, "readme");
