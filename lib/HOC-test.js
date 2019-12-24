import React from "react";

export default Comp => {
  // 防止原有属性丢失
  // return function HOCComp({ name, ...rest }) {
  //   const newName = name + "HHHHHHOC";
  //   return <Comp {...rest} name={newName} />;
  // };
  return function HOCComp({ Component, pageProps, ...rest }) {
    // console.log(Component, pageProps);
    if (pageProps) {
      pageProps.test = "hoc";
    }
    return <Comp Component={Component} pageProps={pageProps} {...rest} />;
  };
};
