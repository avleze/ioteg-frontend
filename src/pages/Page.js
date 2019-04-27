import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Paper } from "@material-ui/core";
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { withRouter } from 'react-router';
class Page extends React.Component {

    appBar() {
        return (<AppBar color="primary" position="static">
            <Toolbar>
                <IconButton color="inherit" onClick={() => this.props.history.goBack()} aria-label="Close">
                    <ChevronLeft />
                </IconButton>
                <Typography variant="button" color="inherit">
                    BACK
            </Typography>
            </Toolbar>
        </AppBar>);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.topBar === undefined ? this.appBar() : null}
                <Paper elevation={5} style={{ paddingTop: 20, paddingBottom: 20 }}>
                    {this.props.children}
                </Paper>
            </React.Fragment>);
    }
}

export default withRouter(Page);