import React from "react";
// babel 会在webpack编译前先把它解析为以下代码
// import Button from "antd/lib/button"
import { Button } from "antd";

const Index = () => {
  return (
    <>
    <Button>ANTD BUTTON</Button>
    <p>Index Page</p>
    </>
  );
};
export default Index;
