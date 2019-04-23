import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import PasswordVerificationIndicator from '../utils/PasswordVerificationIndicator';
import { signup } from '../../redux/reducers/auth';
import notify from '../../lib/notifier';
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
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      errors: {}
    }

    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFieldChange(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
      errors: {}
    });
  }

  onSubmit(ev) {
    ev.preventDefault();
    signup(this.state).then(response => {
      notify({ content: "Registration successful", variant: "success" });
      this.props.history.push("/signin");
    }).catch((error) => {

      let errors = {};

      error.response.data["subErrors"].forEach(error => {
          errors[error.field] = error.message;
      });

      this.setState({
          errors: errors
      });

      notify({ content: "Registration failed", variant: "error" });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PersonAdd />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
        </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth error={this.state.errors.email !== undefined}>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" type="email" autoComplete="email" autoFocus value={this.state.email} onChange={this.onFieldChange} />
            </FormControl>
            <FormHelperText error hidden={this.state.errors.email === undefined}>{this.state.errors.email}</FormHelperText>
            <FormControl margin="normal" required fullWidth error={this.state.errors.username !== undefined}>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input name="username" type="username" id="username" autoComplete="username" value={this.state.username} onChange={this.onFieldChange} />
            </FormControl>
            <FormHelperText error hidden={this.state.errors.username === undefined}>{this.state.errors.username}</FormHelperText>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="new-password" value={this.state.password} onChange={this.onFieldChange} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="repeatPassword">Repeat password</InputLabel>
              <Input name="repeatPassword" type="password" id="repeatPassword" autoComplete="new-password" value={this.state.repeatPassword} onChange={this.onFieldChange} />
            </FormControl>
            <PasswordVerificationIndicator password={this.state.password} repeatPassword={this.state.repeatPassword} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={this.state.password !== this.state.repeatPassword}
              className={classes.submit}
            >
              SIGN UP
          </Button>
          </form>
        </Paper>
      </main>
    );
  }

}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(SignUp));
