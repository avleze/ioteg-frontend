import { SET_AUTH_ACTION } from "../../config/action-types";

import Axios from "axios";

export const SIGNUP_ENDPOINT = "/api/users";
export const CHANGE_PASSWORD_ENDPOINT = `/api/users/{id}/password`;

const apiUrl = "/api/users";


export function auth(state = {}, action) {
    switch (action.type) {
        case SET_AUTH_ACTION:
            if(action.payload.token)
                localStorage.setItem('token', action.payload.token)
            return { ...action.payload };
        default:
            return { isLoggedIn: false };
    }
}

export function signin(userData) {

    let endpointUrl = `${apiUrl}/signin`;

    return function (dispatch) {
        return Axios.post(endpointUrl, {
            username: userData.username, password: userData.password
        }).then(response => {
            dispatch({
                type: SET_AUTH_ACTION,
                payload: { ...response.data, isLoggedIn: true, token: response.headers.authorization },
            })
            return response;
        }).catch(error => {
            console.log(error)

            dispatch({
                type: SET_AUTH_ACTION,
                payload: { isLoggedIn: false, hasError: true },
            })
            setTimeout(() => {
                dispatch({
                    type: SET_AUTH_ACTION,
                    payload: { isLoggedIn: false, hasError: false },
                })
            }, 2000)
            return error;
        })

    }
}

export function signup(userData) {
    let endpointUrl = `${apiUrl}`;

    return Axios.post(endpointUrl, {
        username: userData.username, password: userData.password, email: userData.email
    });
}

export function changePassword(id, passwordDTO) {
    let endpointUrl = `${apiUrl}/${id}/password`;

    return Axios.patch(endpointUrl, passwordDTO);
}

export function getUser(id) {

    let endpointUrl = `${apiUrl}/${id}`;

    return function (dispatch) {

        return Axios.get(endpointUrl).then(response => {
            dispatch({
                type: SET_AUTH_ACTION,
                payload: { ...response.data, isLoggedIn: true },
            });
            return response;
        });

    }
}