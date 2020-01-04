// 重写默认的app.js
import App from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
import "antd/dist/antd.css";
import React from "react";
import withRedux from "../lib/with-redux";
import reduxStore from "../store";
import Link from "next/link";
import { Provider } from "react-redux";
import Loading from "../components/loading";
import Container from "../components//Container";
import Router from "next/router";
import axios from "axios";
class CustomApp extends App {
  state = {
    context: "vaaaalue",
    loading: false
  };

  startLoading = () => {
    console.log("start");
    this.setState({ loading: true });
  };
  finishLoading = () => {
    this.setState({ loading: false });
  };

  componentDidMount() {
    // 页面切换
    Router.events.on("routeChangeStart", this.startLoading);
    Router.events.on("routeChangeComplete", this.finishLoading);
    Router.events.on("routeChangeError", this.finishLoading);
  }
  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading);
    Router.events.off("routeChangeComplete", this.finishLoading);
    Router.events.off("routeChangeError", this.finishLoading);
  }

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
          {this.state.loading ? <Loading /> : null}
          <Layout>
            <Link href="/">
              <a>Index</a>
            </Link>
            <Link href="/detail">
              <a>Detail</a>
            </Link>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </>
    );
  }
}
export default withRedux(CustomApp);
