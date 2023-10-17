import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { loginSuccess } from '~/store/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';

export default function LoginSuccess() {
    const { userId, refresh_token } = useParams();

    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loginSuccess(userId, refresh_token));
    }, []);

    return <div>{isLoggedIn ? <Navigate to={'/home'} replace={true} /> : <h3>Yêu cầu bạn hãy đăng nhập</h3>}</div>;
}
