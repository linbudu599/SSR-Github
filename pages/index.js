import React, { useEffect } from "react";
import { Button, Icon, Tabs } from "antd";
import getConfig from "next/config";
import { connect } from "react-redux";
import Repo from "../components/repo";
import Router, { withRouter } from "next/router";
import LRU from "lru-cache";

const axios = require("axios");
const api = require("../lib/api");

const { publicRuntimeConfig } = getConfig();

const cache = new LRU({
  // 十分钟内不使用（.get()等），即会删除缓存
  maxAge: 1000 * 60 * 10
});

// 公共变量与缓存，需要考虑是否是服务端
// 如果在服务端也执行缓存，则不同用户都会得到相同缓存

const isServer = typeof window === "undefined";

const Index = ({ userRepos, userStarredRepos, user, router }) => {
  // console.log(userRepos, userStarredRepos, user);

  const tabKey = router.query.key || "1";

  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`);
  };

  useEffect(() => {
    if (!isServer) {
      // 缓存在客户端
      // 可能是null
      if (userRepos) {
        cache.set("userRepos", userRepos);
      }
      if (userStarredRepos) {
        cache.set("userStarredRepos", userStarredRepos);
      }
    }
    return () => {};
  }, [userRepos, userStarredRepos]);

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>请先登陆~</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          去登陆~
        </Button>
        <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="root">
        <div className="user-info">
          <img src={user.avatar_url} alt="avatar" className="avatar" />
          <span className="login">{user.login}</span>
          <span className="name">{user.name}</span>
          <span className="bio">{user.bio}</span>
          <p className="email">
            <Icon type="mail" style={{ marginRight: 10 }}>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </Icon>
          </p>
        </div>
        <div className="user-repos">
          <Tabs
            defaultActiveKey={tabKey}
            onChange={handleTabChange}
            animated={false}
          >
            <Tabs.TabPane tab="你拥有的仓库" key="1">
              {userRepos.map((repo, idx) => {
                return <Repo idx={idx} repo={repo} />;
              })}
            </Tabs.TabPane>
            <Tabs.TabPane tab="你star的仓库" key="2">
              {userStarredRepos.map((repo, idx) => {
                return <Repo idx={idx} repo={repo} />;
              })}
            </Tabs.TabPane>
          </Tabs>
        </div>
        <style jsx>{`
          .root {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
          }
          .user-info {
            width: 200px;
            margin-right: 40px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
          }
          .login {
            font-weight: 800;
            font-size: 20px;
            margin-top: 20px;
          }
          .name {
            font-size: 16px;
            color: #777;
          }
          .bio {
            margin-top: 20px;
            color: #333;
          }
          .avatar {
            width: 100%;
            border-radius: 5px;
          }
          .user-repos {
            flex-grow: 1;
          }
        `}</style>
      </div>
    </>
  );
};

// 客户端页面跳转时会调用，同时如果服务端渲染时访问index页面也会调用
// ssr时处于nodejs环境
Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const { user } = reduxStore.getState();

  if (!user || !user.id) {
    return {
      isLogin: false
    };
  }
  if (!isServer) {
    if (cache.get("userRepos") && cache.get("userStarredRepos")) {
      return {
        userRepos: cache.get("userRepos"),
        userStarredRepos: cache.get("userStarredRepos")
      };
    }
  }

  // req与res只有在ssr时有
  const userRepos = await api.request(
    {
      url: "/user/repos"
    },
    ctx.req,
    ctx.res
  );
  const userStarredRepos = await api.request(
    {
      url: "/user/starred"
    },
    ctx.req,
    ctx.res
  );

  return {
    userRepos: userRepos.data,
    userStarredRepos: userStarredRepos.data,
    isLogin: true
  };
};
// 注意withRouter要放在外面
export default withRouter(
  connect(function mapStateToProps(state) {
    return { user: state.user };
  })(Index)
);
