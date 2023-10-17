import { apiLoginSuccess } from '../../apis/authService';
import actionTypes from './actionTypes';

export const loginSuccess = (id, refresh_token) => async (dispatch) => {
    try {
        let response = await apiLoginSuccess(id, refresh_token);
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response.data.token,
            });
        } else {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: null,
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            data: null,
        });
    }
};

export const logout = () => ({
    type: actionTypes.LOGOUT,
});
