import PropTypes from 'prop-types'
import React, { Component } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

class ErrorBar extends Component {
  state = {
    open: false
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={true}
          autoHideDuration={6000}
          onClose={this.props.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={this.props.message}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.props.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

ErrorBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default ErrorBar
