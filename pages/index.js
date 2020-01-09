import React, { useEffect } from "react";
import { Button, Icon } from "antd";
import getConfig from "next/config";
import { connect } from "react-redux";
import Repo from "../components/repo";

const axios = require("axios");
const api = require("../lib/api");

const { publicRuntimeConfig } = getConfig();

const Index = ({ userRepos, userStarredRepos, user }) => {
  // console.log(userRepos, userStarredRepos, user);

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
          {userRepos.map(repo => {
            return <Repo repo={repo} />;
          })}
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

export default connect(function mapStateToProps(state) {
  return { user: state.user };
})(Index);
