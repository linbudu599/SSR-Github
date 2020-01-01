import React from "react";
// 这实际上是initializeStore方法
import createStore from "../store";

// 判断是否有服务端
const isServer = typeof window === "undefined";
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

const getOrCreateStore = initialState => {
  if (isServer) {
    console.log("ssr store");
    return createStore(initialState);
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    console.log("csr store");
    window[__NEXT_REDUX_STORE__] = createStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
};

export default Comp => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { Component, pageProps, ...rest } = this.props;
      if (pageProps) {
        pageProps.test = "hoc";
      }
      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      );
    }
  }
  WithReduxApp.getInitialProps = async ctx => {
    // 属性里面的ctx才是koa的那个ctx！
    // req可能是不存在的，只有在服务端渲染时才会存在
    let reduxStore;

    let appProps = {};
    if (isServer) {
      const { req } = ctx.ctx;
      const session = req.session;
      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
        });
      } else {
        reduxStore = getOrCreateStore({});
      }
    } else {
      reduxStore = getOrCreateStore({});
    }
    ctx.reduxStore = reduxStore;

    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }
    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    };
  };
  return WithReduxApp;
};
