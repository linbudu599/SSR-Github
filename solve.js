let top = { aa: 1, bb: 2 };
let result = [{ cc: 3 }, { dd: 4 }, { ee: 5 }];

const cloneObjDeep = obj => JSON.parse(JSON.stringify(obj));

const res = result.map(item => {
  // 如果不cloneDeep会出现问题，建议深究
  const newItem = Object.assign(top, { params: item });
  return cloneObjDeep(newItem);
});
console.log(res);
