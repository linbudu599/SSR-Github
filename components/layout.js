import React from "react";
import Link from "next/link";
export default ({ children }) => (
  <>
    <header>
      <Link href="/a?id=heiheihei">aaa</Link>
    </header>
    {children}
  </>
);
