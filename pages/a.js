import { withRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Title = styled.h1`
  color: steelblue;
  font-size: 68px;
`;

const Test = withRouter(props => {
  const { router } = props;
  return (
    <>
      <Title>Title On Styled-Components</Title>
      <p>{router.query.id}</p>
      {/* <p>{name}</p> */}
      <p>1111111111</p>
    </>
  );
});

Test.getInitialProps = async ctx => {
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({ name: "linbudu" });
    }, 1000);
  });
  return { ...promise };
};

export default Test;
