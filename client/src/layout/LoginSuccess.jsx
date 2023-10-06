import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { loginSuccess } from '~/store/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';

export default function LoginSuccess() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loginSuccess(userId));
    }, []);

    return <div>{isLoggedIn && <Navigate to={'/'} replace={true} />}</div>;
}
