import React from "react";
import PropTypes from "prop-types";
import Alert from "@material-ui/lab/Alert";

function MessageAlert(props) {
  return (
    <Alert
      style={{
        width: "100%",
        marginBottom: "10px",
        padding: "5px",
        overflow: "auto",
        boxSizing: "border-box",
      }}
      severity={props.type}
    >
      {props.children}
    </Alert>
  );
}

MessageAlert.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default MessageAlert;
