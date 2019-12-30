import React, { cloneElement } from "react";

const style = {
  width: "100%",
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 20,
  paddingRight: 20
};

export default ({ children, renderer = <div /> }) => {
  // 跟根据传入的节点克隆一份，并将自己的属性赋值上去
  return cloneElement(renderer, {
    style: Object.assign({}, renderer.props?.style, style),
    children
  });
};
