import * as React from 'react';
import { Button, DialogContent, Dialog, DialogTitle, DialogActions, DialogContentText } from "@material-ui/core";

let openConfirmationFn;

let onConfirmation = () => {}

export class ConfirmationDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false,
        }

        this.openConfirmation = this.openConfirmation.bind(this);
        this.handleNo = this.handleNo.bind(this);
        this.handleYes = this.handleYes.bind(this);
    }

    componentDidMount() {
        openConfirmationFn = this.openConfirmation;
    }

    openConfirmation() {
        this.setState({
            opened: true
        })
    }

    handleYes() {
        onConfirmation();
        this.setState({
            opened: false
        })
    }

    handleNo() {
        this.setState({
            opened: false
        })
    }

    render() {
        return (<Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="sm"
            onEntering={this.handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={this.state.opened}
        >
            <DialogTitle id="confirmation-dialog-title">Confirmation</DialogTitle>
            <DialogContent>
               <DialogContentText>
                   Are you sure you want to perform this action?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleNo} color="primary">
                    No
              </Button>
                <Button onClick={this.handleYes} color="primary">
                    Yes
              </Button>
            </DialogActions>
        </Dialog>
        );
    }
}

export function openConfirmationDialog(onConfirmationFn) {
    openConfirmationFn();
    onConfirmation = onConfirmationFn;
}