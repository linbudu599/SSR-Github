// 其实不用，但是eslint不让不用
import React from "react";
// babel 会在webpack编译前先把它解析为以下代码
// import Button from "antd/lib/button"
import { Button } from "antd";
import Link from "next/link";

const Index = () => {
  return (
    <>
      <Button>ANTD BUTTON</Button>
      <p>Index Page</p>
      <Link href="/a?id=1212" as="/a/1212">
        <a>Go！</a>
      </Link>
    </>
  );
};
export default Index;
