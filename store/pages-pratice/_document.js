import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

// HOC
// const withLog = Comp => {
//   return props => {
//     console.log(props);
//     return <Comp {...props} />;
//   };
// };

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // 通过将该属性指定为新的方法，使得在初次渲染时能为我们执行一些新的东西
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // 增强App与Component（pages页面下的每一个文件）
          // 渲染完APP后产生的css代码会被挂载到sheet对象上
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
          // enhanceComponent: Component => withLog(Component)
        });
      const props = await Document.getInitialProps(ctx);
      return {
        ...props,
        styles: (
          <>
            {/* 内置的所有css样式，因为要覆盖它所以要传进去 */}
            {props.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          {/* 不应该写在这里奥 */}
          {/* <title>My Own App</title> */}
          {/* <style>{`.test {background-color:steelblue}`}</style> */}
        </Head>
        <body className="test">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
