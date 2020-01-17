import React, { useState, useCallback, useRef } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import api from "../lib/api";

const { Option } = Select;

const SearchUser = ({ onChange, value }) => {
  const latestFetchId = useRef(0);
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const fetchUser = useCallback(
    debounce(async value => {
      console.log(`Fetching User ${value}`);

      latestFetchId.current += 1;
      const fetchId = latestFetchId.current;

      setFetching(true);
      // 清空之前的用户数据，开始获取新的
      setOptions([]);

      api
        .request({
          url: `/search/users?q=${value}`
        })
        .then(res => {
          console.log(res);
          // 如果不等，则说明前一次的请求结果可以被抛弃了
          //   // 上一次是1，而这一次已经是2了
          if (fetchId !== latestFetchId.current) {
            return;
          }
          const data = res.data.items.map(({ login }) => ({
            text: login,
            value: login
          }));
          setFetching(false);
          setOptions(data);
        });
    }, 500),
    []
  );

  const handleOptChange = value => {
    setOptions([]);
    // 用户已经选择
    setFetching(false);
    onChange(value);
  };

  return (
    <Select
      style={{ width: 200 }}
      showSearch={true}
      notFoundContent={
        fetching ? <Spin size="small" /> : <span>这里什么都没有...</span>
      }
      filterOption={false}
      placeholder="创建者"
      onSearch={fetchUser}
      value={value}
      onChange={handleOptChange}
      allowClear={true}
    >
      {options.map(({ value, text }) => {
        return (
          <Option value={value} key={value}>
            {text}
          </Option>
        );
      })}
    </Select>
  );
};

export default SearchUser;
