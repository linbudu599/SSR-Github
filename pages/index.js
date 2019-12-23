// 其实不用，但是eslint不让不用
import React from "react";
// babel 会在webpack编译前先把它解析为以下代码
// import Button from "antd/lib/button"
import { Button } from "antd";
import Link from "next/link";

import { connect } from "react-redux";

import { addCreators } from "../store";

const Index = ({ counter, user }) => {
  return (
    <>
      <Button>ANTD BUTTON</Button>
      <p>Index Page</p>
      <Link href="/a?id=1212" as="/a/1212">
        <a>Go！a</a>
      </Link>
      <Link href="/b">
        <a>Go！b</a>
      </Link>
      <p>counter: {counter}</p>
      <p>username: {user}</p>
    </>
  );
};

const mapStateToProps = state => ({
  counter: state.count.count,
  user: state.user.username
});

const mapDispatchToProps = dispatch => ({
  // add:(num)=>dispatch({})
});

Index.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch(addCreators(555))
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
