const query = {
  owner: "linbudu",
  repo: "weather-msg-sender"
};
console.log(Object.entries(query));
console.log(
  Object.entries(query).reduce((result, entry) => {
    result.push(entry.join("="));
    return result;
  }, [])
);
