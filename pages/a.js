import { withRouter } from "next/router";
import React from "react";

const Test = withRouter(props => {
  const { router } = props;
  return (
    <>
      <p>{router.query.id}</p>
      <p>1111111111</p>
    </>
  );
});
export default Test;
