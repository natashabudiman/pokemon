import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Paper, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "15px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "350px",
    },
  },
  body: {
    color: "#4295F4",
    fontSize: "20px",
    textAlign: "center",
  },
  btnRow: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  tryAgainBtn: {
    width: "45%",
    borderColor: "#00CCA1",
    color: "#00CCA1",
    borderWidth: "1px",
    backgroundColor: "white",
    fontSize: "12px",
  },
  closeBtn: {
    width: "45%",
    fontSize: "12px",
  },
}));

function CatchFailedModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Modal className="modal" open={props.open} onClose={props.onClose}>
      <Paper className={`centeredContent ${classes.container}`}>
        <div className={classes.body}>{t("catchFailed")}</div>
        <div className={classes.btnRow}>
          {props.onTryAgain && (
            <Button
              id="tryAgainBtn"
              variant="outlined"
              className={classes.tryAgainBtn}
              onClick={props.onTryAgain}
            >
              {t("tryAgain")}
            </Button>
          )}
          <Button
            className={`button ${classes.closeBtn}`}
            onClick={props.onClose}
          >
            {t("back")}
          </Button>
        </div>
      </Paper>
    </Modal>
  );
}

CatchFailedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTryAgain: PropTypes.func,
};

export default CatchFailedModal;
