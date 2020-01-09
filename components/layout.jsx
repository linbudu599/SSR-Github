import React, { useState, useCallback } from "react";
import getConfig from "next/config";
import Link from "next/link";
import { logout } from "../store";
import { withRouter, Router } from "next/router";
import axios from "axios";

import {
  Layout,
  Button,
  Icon,
  Input,
  Avatar,
  Tooltip,
  Dropdown,
  Menu
} from "antd";
import Container from "./Container";
import { connect } from "react-redux";
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { publicRuntimeConfig } = getConfig();

const githubIconStyle = {
  color: "white",
  fontSize: 40,
  display: "block",
  paddingTop: 10,
  marginRight: 20
};

const footerStyle = {
  textAlign: "center"
};

const Comp = ({ color, children, style }) => (
  <div style={{ color, ...style }}>{children}</div>
);

const LayoutComp = ({ children, user, logout, router }) => {
  const ssrQuery = router.query && router.query.query;

  const [search, setSearch] = useState(ssrQuery || "");
  const handleInputSearch = useCallback(
    event => {
      setSearch(event.target.value);
    },
    [setSearch]
  );

  const handleOnSearch = useCallback(() => {
    Router.push(`/search?query=${search}`);
  }, [search]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleGoOAuth = useCallback(
    e => {
      e.preventDefault();
      axios
        .get(`/pre-auth?url=${router.asPath}`)
        .then(res => {
          if (res.status === 200) {
            // eslint-disable-next-line
            location.href = publicRuntimeConfig.OAUTH_URL;
          } else {
            console.log("pre auth failed");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    [router.asPath]
  );

  const userDropDown = () => {
    return (
      <Menu>
        <Menu.Item>
          {/* 应当是围绕着store进行 */}
          <a onClick={handleLogout}>登出</a>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <>
      <Layout className="layout">
        <Header>
          <Container renderer={<div className="header-inner" />}>
            <div className="header-left">
              <div className="logo">
                <Link href="/">
                  <Icon type="github" style={githubIconStyle} />
                </Link>
              </div>
              <div>
                <Search
                  placeholder="搜索仓库"
                  value={search}
                  onChange={handleInputSearch}
                  onSearch={handleOnSearch}
                />
              </div>
            </div>
            <div className="header-right">
              <div className="user">
                {user && user.id ? (
                  <Dropdown overlay={userDropDown}>
                    <a href="/">
                      <Avatar size={40} src={user.avatar_url} />
                    </a>
                  </Dropdown>
                ) : (
                  <Tooltip title="点击登录">
                    <a
                      href={publicRuntimeConfig.OAUTH_URL}
                      onClick={handleGoOAuth}
                    >
                      <Avatar size={40} icon="user" />
                    </a>
                  </Tooltip>
                )}
              </div>
            </div>
          </Container>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          {/* 也可以renderer={<div></div>} */}
          <Container renderer={<Comp />}>{children}</Container>
        </Content>
        <Footer style={footerStyle}>Ant Design ©2018 Created by Ant UED</Footer>
        <style jsx>{`
          .header-inner {
            display: flex;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: flex-start;
          }
        `}</style>
        <style jsx global>{`
          #__next,
          .ant-layout {
            min-height: 100%;
          }
          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }
          .ant-layout-content {
            background: #ffffff;
          }
        `}</style>
      </Layout>
    </>
  );
};
export default connect(
  function mapState(state) {
    return { user: state.user };
  },
  function mapReducer(dispatch) {
    return { logout: () => dispatch(logout()) };
  }
)(withRouter(LayoutComp));
