import { createStore, applyMiddleware, combineReducers } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  count: 0
};

const userState = {
  username: "linbudu"
};

export const addCreators = num => {
  return {
    type: "ADD",
    num
  };
};

const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        count: action.num ? state.count + action.num : state.count + 1
      };
    default:
      return state;
  }
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "rename":
      return {
        ...state,
        username: state.username
      };
    default:
      return state;
  }
};

const store = createStore(
  combineReducers({ count: countReducer, user: userReducer }),
  {
    count: initialState,
    user: userState
  },
  composeWithDevTools(applyMiddleware(reduxThunk))
);

const initializeStore = state => {
  const store = createStore(
    combineReducers({ count: countReducer, user: userReducer }),
    Object.assign(
      {},
      {
        count: initialState,
        user: userState
      },
      // 后传入的state优先级最高
      state
    ),
    composeWithDevTools(applyMiddleware(reduxThunk))
  );
  return store;
};
export default initializeStore;
// export default store;
