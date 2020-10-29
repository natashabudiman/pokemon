import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { Grid, CircularProgress } from "@material-ui/core";
import MessageAlert from "components/messageAlert";
import CustomIndicator from "components/customIndicator";
import { getPokemonList } from "stores/Pokemon/actions";
import { setBottomActiveMenu } from "stores/Application/actions";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
    textAlign: "center",
  },
  content: {
    marginTop: "5px",
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      margin: "5px 10px",
      color: "#00CCA1",
      fontSize: "16px",
      fontWeight: "bold",
    },
  },
  item: {
    textAlign: "center",
    borderRadius: "15px",
    border: "1px solid #00CCA1",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "5px",
      margin: "5px",
      width: "100px",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "10px",
      margin: "10px",
      width: "150px",
    },
  },
  itemImage: {
    [theme.breakpoints.down("sm")]: {
      height: "70px",
      width: "70px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "100px",
      width: "100px",
    },
  },
  name: {
    color: "#276DA2",
    fontSize: "14px",
    fontWeight: "bold",
  },
  caption: {
    color: "#707070",
    fontSize: "12px",
  },
  count: {
    padding: "5px 10px",
    color: "#707070",
    fontSize: "15px",
  },
  margin: {
    marginTop: "20px",
  },
});

class Pokemon extends Component {
  state = {
    list: [],
    data: null,
    limit: Number(process.env.REACT_APP_LIMIT_PER_PAGE),
    offset: 0,
    reachedEnd: false,
    loaded: false,
  };

  componentDidMount = () => {
    window.addEventListener("scroll", this.onScroll);
    this.getList(0);
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  getList = (offset) => {
    this.props
      .dispatch(getPokemonList(this.state.limit, offset))
      .then((response) => {
        if (this.props.isSuccess) {
          if (response.results.length === 0) {
            this.setState({ reachedEnd: true });
          } else {
            this.setList();
          }

          if (offset === 0) {
            this.setState({ loaded: true });
          }
        }
      });
  };

  setList = () => {
    const { pokemonList, owned } = this.props;
    this.setState({ offset: pokemonList.length });

    let list = [];
    let temp, id, totalOwned;
    pokemonList.forEach((pokemon) => {
      temp = pokemon.url.split("/");
      id = temp[temp.length - 2]; //https://pokeapi.co/api/v2/pokemon/11/
      totalOwned = owned !== null && owned[id] !== undefined ? owned[id] : 0;

      list.push({
        id,
        totalOwned,
        name: pokemon.name,
        imgUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
          id +
          ".png",
      });
    });
    this.setState({ list });
  };

  onScroll = () => {
    if (
      document.documentElement.clientHeight +
        document.documentElement.scrollTop.toFixed() >=
      document.documentElement.scrollHeight
    ) {
      const { reachedEnd, offset } = this.state;
      if (!this.props.isLoading && !reachedEnd) {
        this.getList(offset);
      }
    }
  };

  buildTile = (data, key) => {
    const { t, classes } = this.props;
    return (
      <Grid
        item
        key={key}
        className={classes.item}
        onClick={() => this.onTileClick(data)}
      >
        <div>
          <img
            src={data.imgUrl}
            className={classes.itemImage}
            alt={data.name}
          />
        </div>
        <div className={classes.name}>{data.name}</div>
        <div className={classes.caption}>
          {t("owned")}: {data.totalOwned}
        </div>
      </Grid>
    );
  };

  onTileClick = (data) => {
    this.props.dispatch(setBottomActiveMenu(0));
    this.props.history.push("/home/pokemon-dets", { id: data.id });
  };

  getContent = () => {
    const { classes, t, total, isLoading } = this.props;
    const { list, offset } = this.state;
    return (
      <div className={classes.content}>
        {list && list.length > 0 && (
          <div className={classes.count}>
            {t("showing") +
              " " +
              offset +
              " " +
              t("of") +
              " " +
              total +
              " " +
              t("pokemon")}
          </div>
        )}
        <Grid container alignContent="center" justify="center">
          {list.map((data, key) => this.buildTile(data, key))}
        </Grid>
        {(!list || list.length === 0) && (
          <center className={classes.margin}>
            <img
              src={process.env.PUBLIC_URL + "img/charmander.png"}
              className={classes.itemImage}
              alt="no pokemon"
            />
            <div className={classes.name}>{t("emptyPokemon")}</div>
          </center>
        )}
        {isLoading && (
          <center style={{ padding: "20px 0 px" }}>
            <CircularProgress size={30} />
          </center>
        )}
      </div>
    );
  };

  render() {
    const {
      classes,
      t,
      isLoading,
      isSuccess,
      message,
      errMessage,
    } = this.props;
    const { loaded } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.title}>{t("pokemonList")}</div>
        {!isLoading &&
        ((isSuccess && message !== null) ||
          (!isSuccess && errMessage !== null)) ? (
          <MessageAlert type={message !== null ? "success" : "error"}>
            {message !== null ? message : errMessage}
          </MessageAlert>
        ) : null}
        {loaded ? this.getContent() : null}
        {isLoading && !loaded && <CustomIndicator open={isLoading} />}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    pokemonList: state.Pokemon.list,
    total: state.Pokemon.total,
    owned: state.Pokemon.owned,
    isLoading: state.Application.isLoading,
    isSuccess: state.Pokemon.isSuccess,
    message: state.Pokemon.message,
    errMessage: state.Pokemon.errMessage,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(Pokemon))
);
