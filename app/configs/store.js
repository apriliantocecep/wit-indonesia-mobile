import { createStore, applyMiddleware } from "redux";
import { logger } from "redux-logger";

// REDUCER
import rootReducer from "../reducers";

const middleware = [];
if (__DEV__) {
  middleware.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;