// 其实不用，但是eslint不让不用
import React, { useEffect } from "react";
// babel 会在webpack编译前先把它解析为以下代码
// import Button from "antd/lib/button"
import { Button } from "antd";
import Link from "next/link";
import axios from "axios";
import { connect } from "react-redux";

import { addCreators } from "../store";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Index = ({ counter, user }) => {
  useEffect(() => {
    axios.get("/api/user/info").then(res => {
      console.log(res);
    });
  }, []);
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
      <a href={publicRuntimeConfig.OAUTH_URL}>去登陆</a>
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
  reduxStore.dispatch(addCreators(555));
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
