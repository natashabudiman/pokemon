import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import {
  Modal,
  Paper,
  Button,
  InputLabel,
  Input,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import MessageAlert from "components/messageAlert";
import { isEmpty, minLength } from "util/validation";
import CustomIndicator from "components/customIndicator";

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
      width: "450px",
    },
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  margin: {
    marginBottom: "15px",
  },
  submitBtn: {
    marginTop: "20px",
  },
}));

function CatchSuccessModal(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isLoading, isSuccess, message, modalErrMessage } = props;
  const [state, setState] = useState({
    errors: {
      nickName: "",
    },
    nickName: "",
  });

  const rendered = () => {
    setState({ ...state, nickName: props.defaultValue });
  };

  const handleInputChange = (event) => {
    let { name, value } = event.target;
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let { errors } = state;
    switch (name) {
      case "nickName":
        if (isEmpty(value)) {
          errors.nickName = t("errorEmpty", { field: t("nickName") });
        } else {
          if (minLength(value, 3)) {
            errors.nickName = t("errorMinLength", {
              field: t("nickName"),
              limit: 3,
            });
          } else {
            errors.nickName = "";
          }
        }
        break;
      default:
        break;
    }
    setState({ ...state, errors, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(state).forEach((name) => {
      validateInput(name, state[name]);
    });

    Object.values(state.errors).forEach((val) => {
      val.length > 0 && (valid = false);
    });
    return valid;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      props.onSave(state.nickName);
    }
  };

  const buildInput = (name, label, value) => {
    const { errors } = state;

    return (
      <FormControl
        error={errors[name] !== ""}
        fullWidth
        className={classes.margin}
      >
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Input
          required
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          aria-describedby={`${name}Error`}
        />
        <FormHelperText id={`${name}Error`}>{errors[name]}</FormHelperText>
      </FormControl>
    );
  };
  return (
    <Modal
      className="modal"
      onRendered={rendered}
      open={props.open}
      onClose={props.onClose}
    >
      <Paper className={`centeredContent ${classes.container}`}>
        <div className={classes.title}>{t("catchSuccess")}</div>
        <div className={classes.title}>{t("giveNick")}</div>
        {(isSuccess && message !== null) || modalErrMessage !== null ? (
          <MessageAlert type={message !== null ? "success" : "error"}>
            {message !== null ? message : modalErrMessage}
          </MessageAlert>
        ) : null}
        <form autoComplete="off">
          {buildInput("nickName", t("nickName"), state.nickName)}
        </form>
        <Button
          id="saveCatchBtn"
          className={`button ${classes.submitBtn}`}
          onClick={submit}
        >
          {t("save")}
        </Button>
        {isLoading && <CustomIndicator open={isLoading} />}
      </Paper>
    </Modal>
  );
}

CatchSuccessModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  message: PropTypes.string,
  modalErrMessage: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default CatchSuccessModal;
