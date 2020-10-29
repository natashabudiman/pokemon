import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import moment from "moment";
import { Grid, Button } from "@material-ui/core";
import MessageAlert from "components/messageAlert";
import CatchFailedModal from "components/catchFailedModal";
import CatchSuccessModal from "components/catchSuccessModal";
import CustomIndicator from "components/customIndicator";
import {
  getPokemon,
  updateMyPokemonList,
  clearData,
} from "stores/Pokemon/actions";
import { setBottomActiveMenu } from "stores/Application/actions";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  },
  content: {
    padding: "10px",
  },
  item: {
    margin: "10px",
  },
  image: {
    textAlign: "center",
    borderRadius: "15px",
    border: "1px solid #00CCA1",
    [theme.breakpoints.down("sm")]: {
      height: "150px",
      width: "150px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "200px",
      width: "200px",
    },
  },
  name: {
    color: "#276DA2",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  label: {
    color: "#707070",
    fontSize: "14px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  caption: {
    color: "#707070",
    fontSize: "14px",
    marginBottom: "10px",
  },
  catchBtn: {
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "100px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "150px",
      marginTop: "15px",
    },
  },
});

class PokemonDetails extends Component {
  state = {
    id: null,
    data: null,
    openCatch: false,
    openFailed: false,
    saveError: null,
    loaded: false,
    catched: false,
  };

  componentDidMount = () => {
    const { id } = this.props.location.state;
    this.props.dispatch(getPokemon(id)).then(() => {
      if (this.props.isSuccess) {
        this.setData();
        this.setState({ loaded: true });
      }
    });
  };

  componentWillUnmount() {
    this.props.dispatch(clearData());
  }

  formatString = (original) => {
    let formatted = original.replace("-", " ");
    return formatted;
  };

  formatData = (list, type) => {
    let formatted = [];
    list.forEach((rec) => {
      formatted.push(this.formatString(rec[type].name));
    });
    return formatted;
  };

  setData = () => {
    const { pokemonData, owned } = this.props;
    const { id, sprites, name } = pokemonData;
    let totalOwned = owned !== null && owned[id] !== undefined ? owned[id] : 0;

    let images = [];
    // get image urls
    if (sprites !== undefined && sprites !== null) {
      /*Object.keys(sprites).forEach((key) => {
        images.push(sprites[key]);
      });*/
      images.push(sprites.front_default);
    }
    let abilities = this.formatData(pokemonData.abilities, "ability");
    let types = this.formatData(pokemonData.types, "type");
    let moves = this.formatData(pokemonData.moves, "move");
    let data = {
      id,
      totalOwned,
      name,
      images,
      baseExperience: pokemonData.base_experience,
      abilities,
      types,
      moves,
    };

    this.setState({ data, id });
  };

  catch = () => {
    let items = [true, false];
    let catched = items[Math.floor(Math.random() * items.length)];
    this.setState({ catched });
    if (catched) {
      this.toggleCatch();
    } else {
      this.toggleFailed();
    }
  };

  toggleCatch = () => {
    this.setState((prevState) => ({
      openCatch: !prevState.openCatch,
    }));
  };

  saveCatched = (nickName) => {
    const { t } = this.props;
    let ownedList = JSON.parse(JSON.stringify(this.props.ownedList));
    let owned = { ...this.props.owned };

    //check whether this nickName exists
    let exist = false;
    for (let index = 0; index < ownedList.length; index++) {
      const pokemon = ownedList[index];
      if (pokemon.nickName === nickName) {
        exist = true;
        break;
      }
    }

    if (exist) {
      this.setState({ saveError: t("nickNameExists") });
      return;
    } else {
      this.setState({ saveError: null });
    }

    //save this pokemon to owned list and increment total owned
    const { id } = this.state.data;
    let saveID = id + "-" + moment().format("YYYYMMDDHHMMss");
    let saveData = {
      id: saveID,
      nickName,
    };

    if (owned[id] === undefined) {
      owned[id] = 1;
    } else {
      owned[id] = owned[id] + 1;
    }

    ownedList.push(saveData);
    this.props.dispatch(updateMyPokemonList(ownedList, owned, t("catchDone")));
    this.toggleCatch();
    setTimeout(() => {
      this.props.dispatch(setBottomActiveMenu(2));
      this.props.history.push("/home/my-pokemon");
    }, 1500);
  };

  toggleFailed = () => {
    this.setState((prevState) => ({
      openFailed: !prevState.openFailed,
    }));
  };

  handleTryAgain = () => {
    this.toggleFailed();
    this.catch();
  };

  buildImage = () => {
    const { classes } = this.props;
    const { data } = this.state;
    return (
      <Grid item xs={3} className={classes.item}>
        <img
          src={
            data.images.length > 0
              ? data.images[0]
              : process.env.PUBLIC_URL + "img/no_image.png"
          }
          className={classes.image}
          alt={data.name}
        />
      </Grid>
    );
  };

  buildProfileAndBtn = () => {
    const { t, classes } = this.props;
    const { data } = this.state;
    return (
      <Grid item xs={8} className={classes.item}>
        <div className={classes.name}>{data.name}</div>
        <div className={classes.caption}>
          {t("owned")}: {data.totalOwned}
        </div>
        <Button
          id="catchBtn"
          className={`button ${classes.catchBtn}`}
          onClick={this.catch}
        >
          {t("catch")}
        </Button>
      </Grid>
    );
  };

  getDetailList = (type) => {
    const { t, classes } = this.props;
    const { data } = this.state;
    return (
      <>
        <div className={classes.label}>{t(type)}:</div>
        <ul>
          {data[type].map((rec, key) => (
            <li key={key} className={classes.caption}>
              {rec}
            </li>
          ))}
        </ul>
      </>
    );
  };

  buildTypeGrid = () => {
    const { t, classes } = this.props;
    const { data } = this.state;
    return (
      <Grid item xs={5} className={classes.item}>
        <div>
          <div className={classes.label} style={{ display: "inline" }}>
            {t("baseExperience") + ": "}
          </div>
          <div className={classes.caption} style={{ display: "inline" }}>
            {data.baseExperience}
          </div>
        </div>
        {this.getDetailList("types")}
        {this.getDetailList("abilities")}
      </Grid>
    );
  };

  buildMoveGrid = () => {
    const { classes } = this.props;
    return (
      <Grid item xs={5} className={classes.item}>
        {this.getDetailList("moves")}
      </Grid>
    );
  };

  getContent = () => {
    const { classes } = this.props;
    const { data, openCatch, openFailed, saveError, catched } = this.state;
    return (
      <>
        <Grid container className={classes.content}>
          {this.buildImage()}
          {this.buildProfileAndBtn()}
          {this.buildTypeGrid()}
          {this.buildMoveGrid()}
        </Grid>
        {!catched && (
          <CatchFailedModal
            open={openFailed}
            onClose={this.toggleFailed}
            onTryAgain={this.handleTryAgain}
          />
        )}
        {catched && (
          <CatchSuccessModal
            defaultValue={data.name ? data.name : ""}
            open={openCatch}
            onClose={this.toggleCatch}
            onSave={this.saveCatched}
            modalErrMessage={saveError}
            {...this.props}
          />
        )}
      </>
    );
  };

  render() {
    const { classes, isLoading, isSuccess, message, errMessage } = this.props;
    const { loaded } = this.state;
    return (
      <div className={classes.root}>
        {!isLoading &&
        ((isSuccess && message !== null) ||
          (!isSuccess && errMessage !== null)) ? (
          <MessageAlert type={message !== null ? "success" : "error"}>
            {message !== null ? message : errMessage}
          </MessageAlert>
        ) : null}
        {isLoading && <CustomIndicator open={isLoading} />}
        {loaded ? this.getContent() : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    pokemonData: state.Pokemon.data,
    ownedList: state.Pokemon.ownedList,
    owned: state.Pokemon.owned,
    isLoading: state.Application.isLoading,
    isSuccess: state.Pokemon.isSuccess,
    message: state.Pokemon.message,
    errMessage: state.Pokemon.errMessage,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(PokemonDetails))
);
