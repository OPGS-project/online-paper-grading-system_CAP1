import aixos from 'axios';

//login w gg
export const apiLoginSuccess = (id, refresh_token) =>
    new Promise(async (resolve, reject) => {
        try {
            let response = await aixos({
                method: 'post',
                url: 'http://localhost:8081/api/auth/login-success',
                data: { id, refresh_token },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
