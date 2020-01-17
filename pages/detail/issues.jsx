import React, { useState, useCallback, useEffect } from "react";
import { Avatar, Button, Select, Spin } from "antd";
import withRepoBasic from "../../components/with-repo-basic";
import dynamic from "next/dynamic";
import api from "../../lib/api";
import { getLastUpdated } from "../../lib/util";

import SearchUser from "../../components/SearchUser";

const MdRenderer = dynamic(() => import("../../components/MarkdownRenderer"));

const { Option } = Select;

const CACHE = {};

const Detail = ({ issue }) => {
  return (
    <div className="root">
      <MdRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开Issue讨论界面
        </Button>
      </div>
      <style jsx>{`
        .root {
          backgroud: #fefefe;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  );
};

const IssueItem = ({ issue }) => {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = useCallback(() => {
    // setShowDetail(!showDetail);
    setShowDetail(detail => !detail);
    // 使之不依赖于外部状态
    // 逃避闭包！
  }, []);

  return (
    <>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "隐藏" : "查看"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {issue.labels.map(label => (
              <Label label={label} key={label.id} />
            ))}
          </h6>
          <p className="sub-info">
            <span>Updated At {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <Detail issue={issue} /> : null}
    </>
  );
};

const Label = ({ label }) => {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};
const isServer = typeof window === "undefined";

export const Issues = ({ initIssues, labels, owner, name }) => {
  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState([]);
  const [issues, setIssues] = useState(initIssues);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isServer) {
      CACHE[`${owner}/${name}`] = labels;
    }
  }, [labels, name, owner]);

  const handleCreatorChange = useCallback(value => {
    setCreator(value);
  }, []);

  const handleStateChange = useCallback(value => {
    setState(value);
  }, []);

  const handleLabelChange = useCallback(value => {
    setLabel(value);
  }, []);

  const handleSearch = () => {
    setFetching(true);
    api
      .request({
        url: `/repos/${owner}/${name}/issues${buildQuery(
          creator,
          state,
          label
        )}`
      })
      .then(res => {
        setIssues(res.data);
        setFetching(false);
      })
      .catch(err => {
        console.errpr(err);
        setFetching(false);
      });
  };

  const buildQuery = (creator, state, labels) => {
    let creatorQuery = creator ? `creator=${creator}` : "";
    let stateQuery = state ? `state=${state}` : "";
    let labelQuery = "";
    if (labels && labels.length > 0) {
      labelQuery = `labels=${labels.join(",")}`;
    }

    const queryArr = [];
    if (creatorQuery) queryArr.push(creatorQuery);
    if (stateQuery) queryArr.push(stateQuery);
    if (labelQuery) queryArr.push(labelQuery);

    return `?${queryArr.join("&")}`;
  };

  return (
    <>
      <div className="root">
        <div className="search">
          <SearchUser onChange={handleCreatorChange} value={creator} />

          <Select
            placeholder="状态"
            onChange={handleStateChange}
            value={state}
            style={{ width: 200, marginLeft: 20 }}
          >
            <Option value="all">all</Option>
            <Option value="open">open</Option>
            <Option value="closed">closed</Option>
          </Select>

          <Select
            mode="multiple"
            placeholder="Label"
            onChange={handleLabelChange}
            value={label}
            style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
          >
            {labels.map(({ name, id }) => (
              <Option value={name} key={id}>
                {name}
              </Option>
            ))}
          </Select>

          <Button type="primary" onClick={handleSearch} disabled={fetching}>
            搜索
          </Button>
        </div>
        {fetching ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <div className="issues">
            {issues.map(issue => (
              <IssueItem issue={issue} key={issue.id} />
            ))}
          </div>
        )}
        <style jsx>{`
          .issues {
            border: 1px solid #eee;
            border-radius: 5px;
            margin-bottom: 20px;
            margin-top: 20px;
          }

          .search {
            display: flex;
          }
          .loading {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    </>
  );
};

Issues.getInitialProps = async ({ ctx: { query, req, res } }) => {
  const { owner, name } = query;

  const full_name = `${owner}/${name}`;

  const parallelFetch = await Promise.all([
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues`
      },
      req,
      res
    ),
    CACHE[full_name]
      ? Promise.resolve({ data: CACHE[full_name] })
      : await api.request(
          {
            url: `/repos/${owner}/${name}/labels`
          },
          req,
          res
        )
  ]);

  return {
    owner,
    name,
    initIssues: parallelFetch[0].data,
    labels: parallelFetch[1].data
  };
};

export default withRepoBasic(Issues, "issues");
