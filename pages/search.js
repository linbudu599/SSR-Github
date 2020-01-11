import React, { useCallback, memo } from "react";
import { withRouter } from "next/router";
import { Row, Col, List } from "antd";
import Link from "next/link";
const { Item } = List;
import Router from "next/router";
import Repo from "../components/repo";

const api = require("../lib/api");

const LANGUAGE = ["JavaScript", "HTML", "CSS", "TypeScript", "Java", "Rust"];
const SORT_TYPES = [
  {
    name: "Best Match"
  },
  {
    name: "Most Stars",
    value: "stars",
    order: "desc"
  },
  {
    name: "Fewest Stars",
    value: "stars",
    order: "asc"
  },
  {
    name: "Most Forks",
    value: "forks",
    order: "desc"
  },
  {
    name: "Fewest Stars",
    value: "forks",
    order: "asc"
  }
];

const FilterLink = memo(({ name, ...quert_conditions }) => {
  const handleSearch = () => {
    Router.push({
      pathname: "/search",
      query: { ...quert_conditions }
    });
  };
  let queryWords = `?q=${query}`;
  if (lang) queryWords += `+lang=${lang}`;
  if (sort) queryWords += `$sort=${sort}$order=${order || "desc"}`;

  return (
    // 为了SEO友好，应当是可点击的
    <Link href={`/search${queryWords}`}>
      <a>{name}</a>
    </Link>
  );
});

const selectedItemStyle = {
  borderLeft: "2px solid #e36209",
  fontWeight: 100
};

// onClick={() => {
//   handleSearch({ sort, order, query, lang: item });
// }} 每次都会生成一个新的匿名方法, 八太好
/**
 * sort：排序方式
 * order：排序顺序
 * lang：项目主语言
 * page：分页页面
 */
const Search = ({ router, repos }) => {
  console.log(repos);

  const { ...quert_conditions } = router.query;

  const { query, lang, sort, order } = router.query;

  return (
    <>
      <div className="root">
        <Row gutter={20}>
          <Col span={6}>
            <List
              bordered
              header={<span className="list-header">通过语言筛选</span>}
              style={{ marginBottom: 20 }}
              dataSource={LANGUAGE}
              renderItem={item => {
                const selected = lang === item;
                return (
                  <Item style={selected ? selectedItemStyle : null}>
                    {selected ? (
                      <span>{item}</span>
                    ) : (
                      <FilterLink
                        {...quert_conditions}
                        lang={item}
                        name={item}
                      />
                    )}
                  </Item>
                );
              }}
            />
            <List
              bordered
              header={<span className="list-header">排序</span>}
              dataSource={SORT_TYPES}
              renderItem={item => {
                let selected = false;
                // 如果此时没有排序方式（即未选择），则默认选中 Best Match项
                if (item.name === "Best Match" && !sort) {
                  selected = true;
                  // 否则选中此时和url——query中相匹配的项
                } else if (item.value === sort && item.order == order) {
                  selected = true;
                }
                return (
                  <Item style={selected ? selectedItemStyle : null}>
                    {selected ? (
                      <span>{item.name}</span>
                    ) : (
                      <FilterLink
                        {...quert_conditions}
                        sort={item.order}
                        value={item.value}
                        name={item.name}
                      />
                    )}
                  </Item>
                );
              }}
            />
          </Col>
          <Col span={18}>
            <h3 className="repos-title">共有 {repos.total_count} 个结果</h3>
            {repos.items.map(repo => (
              <Repo repo={repo} key={repo.id} />
            ))}
          </Col>
        </Row>
        <style jsx>{`
          .root {
            padding: 20px 0;
          }
          .list-header {
            font-weight: 800;
            font-size: 16px;
          }
          .repos-titla {
            border-bottom: 1px solid #eee;
            font-size: 24px;
            line-height: 50px;
          }
        `}</style>
      </div>
    </>
  );
};

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query;
  if (!query) {
    return {
      repos: { total_count: 0 }
    };
  }

  let queryWords = `?q=${query}`;
  if (lang) queryWords += `+language:${lang}`;
  if (sort) queryWords += `$sort=${sort}$order=${order || "desc"}`;
  if (page) queryWords += `$page=${page}`;

  const result = await api.request(
    {
      url: `/search/repositories${queryWords}`
    },
    ctx.req,
    ctx.res
  );
  return {
    repos: result.data
  };
};

export default withRouter(Search);
