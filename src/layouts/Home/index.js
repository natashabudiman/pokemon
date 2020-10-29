import React, { Component } from "react";
import { connect } from "react-redux";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Link as MaterialLink,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import { Route, Switch, Link } from "react-router-dom";
import routes from "routes";
import menus from "menus";
import LanguageButton from "components/languageButton";
import { setBottomActiveMenu } from "stores/Application/actions";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  appBar: {},
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  menu: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "block",
      marginLeft: "10px",
      fontWeight: "bold",
    },
  },
  bottomNav: {
    [theme.breakpoints.down("sm")]: {
      bottom: 0,
      width: "100%",
      position: "fixed",
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  logo: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    padding: "10px 0px",
    flexGrow: 1,
  },
  logoImg: {
    width: "150px",
    height: "50px",
    cursor: "pointer",
  },
});

class Home extends Component {
  componentDidMount = () => {
    if (sessionStorage.getItem("locale")) {
      this.props.i18n.changeLanguage(sessionStorage.getItem("locale"));
    } else {
      sessionStorage.setItem("locale", "en");
    }
  };

  getRoutes = (routes) => {
    let listRoutes = [];
    routes.forEach((prop, key) => {
      if (prop.layout === "/home") {
        listRoutes.push(
          <Route
            exact
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
    return listRoutes;
  };

  routeToHome = () => {
    this.props.dispatch(setBottomActiveMenu(1));
    this.props.history.push("/home/pokemon");
  };

  route = (event, prop) => {
    event.preventDefault();
    this.props.dispatch(setBottomActiveMenu(prop.id));
    this.props.history.push(prop.path);
  };

  back = () => {
    if (this.props.history.length > 0) {
      this.routeToHome();
    }
  };

  buildLogoOrBack = () => {
    const { classes, activeMenu } = this.props;
    return (
      <div className={classes.logo}>
        {activeMenu === 0 ? (
          <IconButton size="small" edge="start" onClick={this.back}>
            <ArrowBack />
          </IconButton>
        ) : (
          <img
            className={classes.logoImg}
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="logo"
            onClick={this.routeToHome}
          />
        )}
      </div>
    );
  };

  buildAppBar = () => {
    const { t, classes } = this.props;

    return (
      <AppBar
        position="fixed"
        className={classes.appBar}
        color="default"
        variant="outlined"
      >
        <Toolbar>
          {this.buildLogoOrBack()}
          {menus.map((prop, key) => (
            <MaterialLink
              key={key}
              href={prop.path}
              onClick={(event) => this.route(event, prop)}
              className={classes.menu}
            >
              {t(prop.name)}
            </MaterialLink>
          ))}
          <LanguageButton />
        </Toolbar>
      </AppBar>
    );
  };

  buildBottomNavBar = () => {
    const { t, classes, activeMenu } = this.props;
    return (
      <BottomNavigation
        className={classes.bottomNav}
        value={activeMenu}
        onChange={(event, value) => {
          this.props.dispatch(setBottomActiveMenu(value));
        }}
        showLabels
      >
        {menus.map((prop, key) => (
          <BottomNavigationAction
            key={key}
            component={Link}
            to={prop.path}
            value={prop.id}
            label={t(prop.name)}
            icon={prop.icon}
          />
        ))}
      </BottomNavigation>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {this.buildAppBar()}
        <div className={classes.toolbar}></div>
        <Switch>{this.getRoutes(routes)}</Switch>
        {this.buildBottomNavBar()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeMenu: state.Application.activeMenu,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(Home))
);
