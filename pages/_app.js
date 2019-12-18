// 重写默认的app.js
import App from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
// 会引入全部的CSS，但同样能够异步分模块加载
import "antd/dist/antd.css";
import React from "react";
export default class CustomApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    // 如果当前的页面具有该方法，则需要执行并将结果传入该组件
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log(Component, pageProps);
    return (
      <>
        <Head>
          <title>My new cool app</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}

