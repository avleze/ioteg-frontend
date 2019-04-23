import * as React from "react";
import PropTypes from 'prop-types';

import { Drawer, Button, Typography, List, Divider } from "@material-ui/core";

import Home from '@material-ui/icons/Home';
import SettingsRemote from '@material-ui/icons/SettingsRemote';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import AccountCircle from '@material-ui/icons/AccountCircle';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LateralMenuButton from "./LateralMenuButton";
import { SET_AUTH_ACTION } from "../../config/action-types";
import { withRouter } from 'react-router';

const lateralMenuWidth = 200;

const styles = theme => ({

    hide: {
        display: "none"
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    drawer: {
        flexShrink: 0,
    },
    drawerPaper: {
        width: lateralMenuWidth,
    }
});

class LateralMenu extends React.Component {
    constructor(props) {
        super(props);

        this.onSignOut = this.onSignOut.bind(this);
    }

    onSignOut() {
        this.props.dispatch({ type: SET_AUTH_ACTION, payload: { isLoggedIn: false } });
        this.props.onToggle();
        this.props.history.push("/")
    }

    render() {
        const { classes } = this.props;

        return (<Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={this.props.opened}
            classes={{
                paper: classNames(classes.drawerPaper, !this.props.opened && classes.hide),
            }}
        >
            <div id="header" className={classes.drawerHeader}>
                <Button onClick={this.props.onToggle}>
                    <Typography variant="button" color="textPrimary" noWrap>
                        {this.props.username}
                    </Typography>
                    <AccountCircle />
                </Button>
            </div>
            <Divider />
            <List>
                <LateralMenuButton icon={<Home />} text="My profile" onClick={() => this.props.history.push("/my-profile")} />
                <LateralMenuButton icon={<SettingsRemote />} text="My channels" onClick={() => this.props.history.push("/my-channels")} />
                <LateralMenuButton icon={<PowerSettingsNew />} text="Sign out" onClick={this.onSignOut} />
            </List>

        </Drawer>)
    }
}

LateralMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    opened: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        ...state.auth
    }
}

export default connect(mapStateToProps)(withStyles(styles)(withRouter(LateralMenu)));