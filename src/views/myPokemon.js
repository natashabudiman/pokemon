import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { Grid, Button } from "@material-ui/core";
import MessageAlert from "components/messageAlert";
import ConfirmModal from "components/confirmModal";
import { updateMyPokemonList, clearData } from "stores/Pokemon/actions";

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
      width: "150px",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "10px",
      margin: "10px",
      width: "200px",
    },
  },
  itemImage: {
    [theme.breakpoints.down("sm")]: {
      height: "100px",
      width: "100px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "150px",
      width: "150px",
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
  releaseBtn: {
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      marginTop: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "150px",
      marginTop: "15px",
    },
  },
});

class MyPokemon extends Component {
  state = {
    list: [],
    total: 0,
    data: null,
    openRelease: false,
    error: "",
    loaded: false,
  };

  componentDidMount = () => {
    this.setList();
  };

  setList = () => {
    const { ownedList } = this.props;
    let list = [];
    let temp, pokemonID;
    ownedList.forEach((pokemon) => {
      temp = pokemon.id.split("-"); //1-20201028214700
      pokemonID = temp[0];

      list.push({
        ...pokemon,
        imgUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
          pokemonID +
          ".png",
      });
    });
    this.setState({ list, total: list.length, loaded: true });
  };

  buildTile = (data, key) => {
    const { t, classes } = this.props;
    return (
      <Grid item key={key} className={classes.item}>
        <div>
          <img
            src={data.imgUrl}
            className={classes.itemImage}
            alt={data.nickName}
          />
        </div>
        <div className={classes.name}>{data.nickName}</div>
        <Button
          className={`button ${classes.releaseBtn}`}
          onClick={() => this.confirmRelease(data)}
        >
          {t("release")}
        </Button>
      </Grid>
    );
  };

  confirmRelease = (data) => {
    this.setState({ openRelease: true, data });
  };

  closeReleaseModal = () => {
    this.setState({ openRelease: false, data: null });
  };

  release = () => {
    const { t } = this.props;
    let ownedList = JSON.parse(JSON.stringify(this.props.ownedList));
    let owned = { ...this.props.owned };

    //delete this pokemon from owned list and decrement total owned
    const { id } = this.state.data;
    let index = ownedList.findIndex((rec) => rec.id === id);
    if (index === -1) {
      this.setState({ error: t("notFound") });
      return;
    } else {
      this.setState({ error: null });
    }

    let pokemonID = id.split("-")[0];
    if (owned[pokemonID] === undefined) {
      owned[pokemonID] = 0;
    } else {
      owned[pokemonID] = owned[pokemonID] - 1;
    }
    ownedList.splice(index, 1);
    this.props.dispatch(
      updateMyPokemonList(ownedList, owned, t("releaseDone"))
    );
    this.closeReleaseModal();
    setTimeout(() => {
      this.props.dispatch(clearData());
      this.setState({ loaded: false }, () => this.setList());
    }, 1500);
  };

  getContent = () => {
    const { classes, t } = this.props;
    const { list, total, openRelease } = this.state;
    return (
      <div className={classes.content}>
        {list && list.length > 0 && (
          <div className={classes.count}>
            {t("youHave") + " " + total + " " + t("pokemon")}
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
        <ConfirmModal
          open={openRelease}
          onClose={this.closeReleaseModal}
          onConfirm={this.release}
        >
          {t("confirmRelease")}
        </ConfirmModal>
      </div>
    );
  };

  render() {
    const { classes, t, isLoading, isSuccess, message } = this.props;
    const { loaded, error } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.title}>{t("myPokemonList")}</div>
        {!isLoading &&
        ((isSuccess && message !== null) || (!isSuccess && error !== null)) ? (
          <MessageAlert type={message !== null ? "success" : "error"}>
            {message !== null ? message : error}
          </MessageAlert>
        ) : null}
        {loaded ? this.getContent() : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    ownedList: state.Pokemon.ownedList,
    owned: state.Pokemon.owned,
    isLoading: state.Application.isLoading,
    isSuccess: state.Pokemon.isSuccess,
    message: state.Pokemon.message,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(MyPokemon))
);
