import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { ListItemIcon } from '@material-ui/core';
import CloudDownload from '@material-ui/icons/CloudDownload';

const formats = ['CSV', 'JSON', 'XML'];


export default class SelectDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.props.open}>
        <DialogTitle id="simple-dialog-title">Please choose the desired format:</DialogTitle>
        <div>
          <List>
            {formats.map(format => (
              <ListItem button onClick={() => this.handleListItemClick(format)} key={format}>
                <ListItemIcon><CloudDownload /></ListItemIcon>
                <ListItemText primary={format} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

SelectDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string,
};

