import React, { memo, isValidElement } from "react";
import { withRouter } from "next/router";
import { Row, Col, List, Pagination } from "antd";
import Link from "next/link";
import Repo from "../components/repo";
const { Item } = List;

const api = require("../lib/api");

const LANGUAGES = ["JavaScript", "HTML", "CSS", "TypeScript", "Java", "Rust"];

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

const per_page = 20;

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  let queryWords = `?query=${query}`;
  if (lang) queryWords += `&lang=${lang}`;
  if (sort) queryWords += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryWords += `&page=${page}`;

  queryWords += `&per_page=${per_page}`;

  return (
    // 为了SEO友好，应当是可点击的
    <Link href={`/search${queryWords}`}>
      {/* Pagination组件的name属性可能是一个组件 */}
      {isValidElement(name) ? name : <a>{name}</a>}
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
  const { ...query_conditions } = router.query;

  const { lang, sort, order, page } = router.query;

  return (
    <>
      <div className="root">
        <Row gutter={20}>
          <Col span={6}>
            <List
              bordered
              header={<span className="list-header">通过语言筛选</span>}
              style={{ marginBottom: 20 }}
              dataSource={LANGUAGES}
              renderItem={item => {
                const selected = lang === item;
                return (
                  <Item style={selected ? selectedItemStyle : null}>
                    {selected ? (
                      <span>{item}</span>
                    ) : (
                      <FilterLink
                        {...query_conditions}
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
                } else if (item.value === sort && item.order === order) {
                  selected = true;
                }
                return (
                  <Item style={selected ? selectedItemStyle : null}>
                    {selected ? (
                      <span>{item.name}</span>
                    ) : (
                      <FilterLink
                        {...query_conditions}
                        sort={item.value}
                        order={item.order}
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
            <div className="pagination">
              <Pagination
                pageSize={per_page}
                current={Number(page) || 1}
                // github api限制 对于每个query最多返回1000条结果
                total={1000}
                onChange={() => {}}
                itemRender={(page, type, ol) => {
                  let p;
                  if (type === "page") {
                    p = page;
                  } else if (type === "prev") {
                    p = page - 1;
                  } else {
                    p = page + 1;
                  }
                  const name = type === "page" ? page : ol;
                  return (
                    <FilterLink {...query_conditions} page={p} name={name} />
                  );
                }}
              />
            </div>
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
          .repos-title {
            border-bottom: 1px solid #eee;
            font-size: 24px;
            line-height: 50px;
          }
          .pagination {
            padding: 20px;
            text-align: center;
          }
        `}</style>
      </div>
    </>
  );
};

// 获取搜索条件
Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query;
  console.log(query, sort, lang, order, page);
  if (!query) {
    return {
      repos: { total_count: 0 }
    };
  }

  let queryWords = `?q=${query}`;
  if (lang) queryWords += `+language:${lang}`;
  if (sort) queryWords += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryWords += `&page=${page}`;
  queryWords += `&per_page=${per_page}`;

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
