import React from "react";
import { Provider } from "react-redux";
import Main from "./Main";
import ReduxStore from "./redux/Store";

export default function App() {
  return (
    <Provider store={ReduxStore}>      
      <Main></Main>      
    </Provider>
  );
}
