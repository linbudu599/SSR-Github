import { withRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import originalComp from "../../components/lazzzy";

import getConfig from "next/config";

const LazyComp = dynamic(import("../../components/lazzzy"));

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const Title = styled.h1`
  color: steelblue;
  font-size: 68px;
`;

const Test = withRouter(props => {
  console.log(serverRuntimeConfig, publicRuntimeConfig);
  const { router, name, time } = props;
  return (
    <>
      <Title>Title On Styled-Components</Title>
      <Title>{time}</Title>
      {/* 渲染到这里时才会去加载 */}
      <LazyComp />
      <p>{router.query.id}</p>
      <p>{name}</p>
      <p>{process.env.customVal}</p>
    </>
  );
});

Test.getInitialProps = async ctx => {
  // 打包为一个单独的包
  const moment = await import("moment");

  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: "linbudu",
        time: moment.default(Date.now() - 60 * 1000).fromNow()
      });
    }, 2000);
  });
  return await promise;
};

export default Test;
