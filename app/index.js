import React from 'react';
import AppContainer from "./AppContainer";
import RootNavigation from "./routes";

import { Provider } from "react-redux";
import store from "./configs/store";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer>
          <RootNavigation />
        </AppContainer>
      </Provider>
    );
  }
}