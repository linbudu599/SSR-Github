import React, { useEffect } from "react";
import Repo from "./repo";
import Link from "next/link";
import { withRouter } from "next/router";
import api from "../lib/api";
import { getCache, setCache } from "../lib/repo-basic-cache";

const isServer = typeof window === "undefined";

const buildQuery = queryObj => {
  const queryStr = Object.entries(queryObj)
    .reduce((result, entry) => {
      result.push(entry.join("="));
      return result;
    }, [])
    .join("&");
  return `?${queryStr}`;
};

export default (Comp, type = "readme") => {
  const WithDetail = ({ repoBasic, router, ...rest }) => {
    const query = buildQuery(router.query);
    // 服务端渲染完成后第一次在客户端渲染时不会调用getInitialProps
    // 因此缓存要放在渲染过程中去
    useEffect(() => {
      if (!isServer) {
        setCache(repoBasic);
      }
      return () => {};
    });
    return (
      <>
        <div className="root">
          <div className="repo-basic">
            <Repo repo={repoBasic} />
            <div className="tabs">
              {type === "readme" ? (
                <span className="tab">README</span>
              ) : (
                <Link href={`/detail${query}`}>
                  <a className="tab readme">README</a>
                </Link>
              )}

              {type === "issues" ? (
                <span className="tab">Issues</span>
              ) : (
                <Link href={`/detail/issues${query}`}>
                  <a className="tab issues">Issues</a>
                </Link>
              )}
            </div>
          </div>
          <div>
            <Comp {...rest} />
          </div>
          <style jsx>{`
            .root {
              padding-top: 20px;
            }
            .repo-basic {
              padding: 20px;
              border: 1px solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .tab + .tab {
              margin-left: 20px;
            }
          `}</style>
        </div>
      </>
    );
  };

  WithDetail.getInitialProps = async context => {
    const { ctx, router } = context;
    const { owner, name } = ctx.query;

    const full_name = `${owner}/${name}`;

    let pageData = {};
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    }
    if (getCache(full_name)) {
      return { repoBasic: getCache(full_name), ...pageData };
    }

    const repoBasic = await api.request(
      {
        url: `/repos/${owner}/${name}`
      },
      ctx.req,
      ctx.res
    );

    return { repoBasic: repoBasic.data, ...pageData };
  };

  return withRouter(WithDetail);
};
