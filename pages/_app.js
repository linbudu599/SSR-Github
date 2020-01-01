// 重写默认的app.js
import App from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
import "antd/dist/antd.css";
import React from "react";
import withRedux from "../lib/with-redux";
import reduxStore from "../store";
import { Provider } from "react-redux";
class CustomApp extends App {
  state = {
    context: "vaaaalue"
  };

  static async getInitialProps(ctx) {
    const { Component, router } = ctx;
    console.log("app init");
    let pageProps = {};

    // 如果当前的页面具有该方法，则需要执行并将结果传入该组件
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    // console.log(reduxStore);
    return (
      <>
        <Head>
          <title>My new cool app</title>
        </Head>
        <Provider store={reduxStore}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </>
    );
  }
}
export default withRedux(CustomApp);
