import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { signin } from '../../redux/reducers/auth';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormHelperText } from '@material-ui/core';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignIn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    }

    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    this.setState({
      username: "",
      password: "",
      remember: false
    });
  }

  onFieldChange(ev) {
    this.setState({
      [ev.target.name]: ev.target.value
    });
  }

  onSubmit(ev) {
    ev.preventDefault();
    this.props.dispatch(signin(this.state)).then((response) => {
      if(response.status === 200)
        this.props.history.push("/")
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
        </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>

            <FormHelperText hidden={!this.props.hasError} error>Bad credentials try it again.</FormHelperText>

            <FormControl margin="normal" required fullWidth error={this.props.hasError}>
              <InputLabel htmlFor="username">Email Address or Username</InputLabel>
              <Input id="username" name="username" autoComplete="username" autoFocus onChange={this.onFieldChange}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth error={this.props.hasError}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" onChange={this.onFieldChange} />
            </FormControl>
         
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
          </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {...state.auth}
}
export default connect(mapStateToProps)(withStyles(styles)(withRouter(SignIn)));
