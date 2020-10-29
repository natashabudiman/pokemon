import React from "react";
import PropTypes from "prop-types";
import { Modal, Paper, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "250px",
    borderRadius: "15px",
    padding: "30px",
  },
}));
function CustomIndicator(props) {
  const classes = useStyles();
  return (
    <Modal className="modal" open={props.open} disableBackdropClick={true}>
      <Paper className={`centeredContent ${classes.container}`}>
        <center style={{ padding: "20px 0 px" }}>
          <CircularProgress size={30} />
        </center>
      </Paper>
    </Modal>
  );
}

CustomIndicator.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default CustomIndicator;
