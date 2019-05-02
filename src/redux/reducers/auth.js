import { SET_AUTH_ACTION } from "../../config/action-types";
import jwt_decode from "jwt-decode";
import Axios from "axios";

export const SIGNUP_ENDPOINT = "/api/users";
export const CHANGE_PASSWORD_ENDPOINT = `/api/users/{id}/password`;

const apiUrl = "/api/users";


export function auth(state = {}, action) {
    switch (action.type) {
        case SET_AUTH_ACTION:
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
            localStorage.setItem('token', response.headers.authorization);
            let userId = jwt_decode(response.headers.authorization).sub;
            Axios.get(`${apiUrl}/${userId}`).then(res => {
                dispatch({
                    type: SET_AUTH_ACTION,
                    payload: { ...res.data, isLoggedIn: true},
                })
            });
           
            return response;
        }).catch(error => {
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
    const header = localStorage.getItem('token');

    return function (dispatch) {

        return Axios.get(endpointUrl, {
            headers: {authorization: header }
        }).then(response => {
            dispatch({
                type: SET_AUTH_ACTION,
                payload: { ...response.data, isLoggedIn: true },
            });
            return response;
        });

    }
}