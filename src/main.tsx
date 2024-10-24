import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import GlobalStyles from "./styles/GlobalStyles.tsx";
import { Fragment } from "react/jsx-runtime";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Fragment>
    <GlobalStyles />
    <App />
  </Fragment>
);
