import { apiLoginSuccess } from '../../apis/authService';
import actionTypes from './actionTypes';

export const loginSuccess = (id, tokenLogin) => async (dispatch) => {
    try {
        let response = await apiLoginSuccess(id, tokenLogin);
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
