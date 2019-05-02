import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class InjectedFieldDialogForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null
        }
    }

    render() {
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add injected field</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill the name of the injected field and click add.
                  </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Injected Field Name"
                            type="text"
                            fullWidth
                            value={this.state.name ? this.state.name : ""}
                            onChange={(e) => this.setState({name: e.target.value})}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} color="primary">
                            Cancel
                  </Button>
                        <Button onClick={() => this.props.onAdd(this.state.name)} color="primary">
                            Add
                  </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

export default InjectedFieldDialogForm;
