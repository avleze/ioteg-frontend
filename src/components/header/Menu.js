import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { NavLink as RouterLink } from 'react-router-dom'
import { withRouter } from 'react-router';
import Link from '@material-ui/core/Link';
import { Typography} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import classNames from 'classnames';
import LateralMenu from './LateralMenu';


const lateralMenuWidth = 200;

const styles = theme => ({
    grow: {
        flexGrow: 1
    },
    hide: {
        display: "none"
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${lateralMenuWidth}px)`,
        marginRight: lateralMenuWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: lateralMenuWidth,
    }
});

class ButtonAppBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lateralMenuOpened: false
        }

        this.toggleLateralMenu = this.toggleLateralMenu.bind(this);
    }

    toggleLateralMenu() {
        this.setState({
            lateralMenuOpened: !this.state.lateralMenuOpened
        })
    }


    loggedOut() {
        if (!this.props.isLoggedIn)
            return (<React.Fragment>
                <Link component={RouterLink} color="inherit" underline="none" to="/signin">
                    <Button color="inherit">SIGN IN</Button>
                </Link>
                <Link component={RouterLink} color="inherit" underline="none" to="/signup">
                    <Button color="inherit">SIGN UP</Button>
                </Link>

            
            </React.Fragment>)
    }

    loggedIn() {
        const { classes } = this.props;
        const lateralMenuOpened = this.state.lateralMenuOpened;

        if (this.props.isLoggedIn)
            return (<React.Fragment>

                <Button onClick={this.toggleLateralMenu} className={classNames(lateralMenuOpened && classes.hide)}>
                    <Typography variant="button" color="textPrimary" noWrap>
                        {this.props.username}
                    </Typography>
                    <AccountCircle />
                </Button>
                <LateralMenu opened={lateralMenuOpened} onToggle={this.toggleLateralMenu}/>
            </React.Fragment>)
    }

   
    render() {
        const { classes } = this.props;
        const lateralMenuOpened = this.state.lateralMenuOpened;

        return (
            <React.Fragment>
                <AppBar color="default" className={classNames(classes.appBar, {
                    [classes.appBarShift]: lateralMenuOpened,
                })}>
                    <Toolbar>
                        <Link component={RouterLink} color="inherit" underline="none" to="/" className={classes.grow}>
                            <img alt="logo" style={{ maxHeight: "20px" }} src="/logo.png" />
                        </Link>
                        {this.loggedOut()}
                        {this.loggedIn()}
                    </Toolbar>
                </AppBar>



                <div id="content" className={classNames(classes.content, {
                    [classes.contentShift]: lateralMenuOpened,
                })}>
                    {this.props.children}
                </div>
            </React.Fragment>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        ...state.auth
    }
}

export default connect(mapStateToProps)(withStyles(styles)(withRouter(ButtonAppBar)));