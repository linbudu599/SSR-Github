import { createStore, applyMiddleware, combineReducers } from "redux";
import axios from "axios";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};

export const logout = () => {
  return dispatch => {
    axios
      .post("/logout")
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: "LOGOUT" });
        } else {
          console.log("logout failed " + res);
        }
      })
      .catch(err => {
        console.log("logout err " + err);
      });
  };
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGOUT": {
      // userReducer 直接对应命名空间下的user
      return {};
    }
    default:
      return state;
  }
};

const initializeStore = state => {
  const store = createStore(
    combineReducers({ user: userReducer }),
    Object.assign(
      {},
      {
        user: initialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(reduxThunk))
  );
  return store;
};
export default initializeStore;
