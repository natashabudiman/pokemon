import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "plugins/i18n";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import Home from "./layouts/Home";
import "./index.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#26CCA1",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0097DC",
      contrastText: "#FFFFFF",
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route path="/home" render={(props) => <Home {...props} />} />
            <Redirect from="/" to="/home/pokemon" />
          </Switch>
        </ThemeProvider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
