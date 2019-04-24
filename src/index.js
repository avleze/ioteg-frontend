import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from './redux/store';
import { SET_AUTH_ACTION } from './config/action-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import setupAxiosInterceptors from './config/axios-interceptors';
import { getUser } from './redux/reducers/auth';
import jwt_decode from 'jwt-decode';

setupAxiosInterceptors(() => store.dispatch({ type: SET_AUTH_ACTION, payload: {} }));

if (localStorage.getItem('token'))
    store.dispatch(getUser(jwt_decode(localStorage.getItem('token').slice(8)).id));

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontSize: 16,
    },
    palette: {
        background: {
            paper: "#fcfcfc"
        }
    }
});



ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
