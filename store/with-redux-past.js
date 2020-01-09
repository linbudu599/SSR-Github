import React from "react";
// 这实际上是initializeStore方法
import createStore from ".";

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
    // 在客户端创建完成store后再把它保存下来
    window[__NEXT_REDUX_STORE__] = createStore(initialState);
  }
  // 初始化时就会在服务端与客户端各调用一次
  return window[__NEXT_REDUX_STORE__];
};

export default Comp => {
  class WithReduxApp extends React.Component {
    // 客户端与服务端渲染时执行 constructor 方法，生成这个store对象
    constructor(props) {
      super(props);
      // 同步客户端与服务端的store
      // 服务端-创建一个新的store
      // 客户端-获取原先的store
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { Component, pageProps, ...rest } = this.props;
      // console.log(Component, pageProps);
      if (pageProps) {
        pageProps.test = "hoc";
      }
      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          // 将store注入到组件中
          reduxStore={this.reduxStore}
        />
      );
    }
  }
  // 该方法来自于APP，在ssr和csr过程中都会被执行一次
  // 该方法返回的内容会被序列化成字符串，再供页面获取
  // <script id="__NEXT_DATA__" type="application/json">
  //     {
  //       "dataManager": "[]",
  //       "props": {
  //         "initialReduxState": {
  //           "count": { "count": 555 },
  //           "user": { "username": "linbudu" }
  //         }
  //       },
  //       "page": "/",
  //       "query": {},
  //       "buildId": "development",
  //       "runtimeConfig": { "staticFolder": "/static" }
  //     }
  //   </script>
  // 客户端读取这个内容再进行转化
  // 同时，这个方法在执行一次以后与其内部的变量会被销毁，下一次再执行时又是新的方法

  // 声明的这个getIP方法来自于APP，即在每次页面切换时都会被调用
  // 因此需要在前端路由中保证整个应用只有一个store对象（维持之前的更新记录）
  // 如果每次都创建一个新的，就会每次都是初始化时的store
  // getOrCreateStore方法会将store对象挂载到window对象上
  WithReduxApp.getInitialProps = async ctx => {
    let appProps = {};
    // 可以传入默认数据
    // 把用户数据作为默认数据传入store，即在用户请求时就会把数据放进去
    // 页面返回时就有数据
    // 而不是像webapp一样先返回页面再等待数据请求完成再次渲染页面
    const reduxStore = getOrCreateStore();

    ctx.reduxStore = reduxStore;

    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }
    return {
      ...appProps,
      // 难以序列化与反序列化，直接读出state返回
      initialReduxState: reduxStore.getState()
    };
  };
  return WithReduxApp;
};
