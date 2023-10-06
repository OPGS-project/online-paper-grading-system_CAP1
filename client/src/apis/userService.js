import aixos from 'axios';

export const apiGetOne = (token) =>
    new Promise(async (resolve, reject) => {
        try {
            let response = await aixos({
                method: 'get',
                url: 'http://localhost:8081/api/user/get-one',
                headers: {
                    authentication: token,
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
