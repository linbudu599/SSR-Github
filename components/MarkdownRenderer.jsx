import React, { memo, useMemo } from "react";
import MarkdownIt from "markdown-it";
import "github-markdown-css";
const md = new MarkdownIt({
  // 将<img/>标签进行转换，使其支持html
  html: true,
  // 使链接能够被点击·
  linkify: true
});

const b64ToUtf8 = str => {
  return decodeURIComponent(escape(atob(str)));
};

export default memo(({ content, isBase64 }) => {
  const markdown = isBase64 ? b64ToUtf8(content) : content;

  const html = useMemo(() => md.render(markdown), [markdown]);

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
});
