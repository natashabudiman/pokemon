import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Paper, Button } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    width: "350px",
    borderRadius: "15px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  yesBtn: {
    width: "45%",
    borderColor: "#00CCA1",
    color: "#00CCA1",
    borderWidth: "1px",
    backgroundColor: "white",
    fontSize: "12px",
  },
  noBtn: {
    width: "45%",
    fontSize: "12px",
  },
});

function ConfirmModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Modal className="modal" open={props.open} onClose={props.onClose}>
      <Paper className={`centeredContent ${classes.container}`}>
        <div className={classes.body}>{props.children}</div>
        <div className={classes.btnRow}>
          {props.onConfirm && (
            <Button
              id="confirmBtn"
              variant="outlined"
              className={classes.yesBtn}
              onClick={props.onConfirm}
            >
              {t("yes")}
            </Button>
          )}
          <Button className={`button ${classes.noBtn}`} onClick={props.onClose}>
            {t("no")}
          </Button>
        </div>
      </Paper>
    </Modal>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
};

export default ConfirmModal;
