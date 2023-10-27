import aixos from 'axios';

export const apiGetOne = (token) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await aixos({
                method: 'get',
                url: 'http://localhost:8081/api/teacher/',
                headers: {
                    authorization: token,
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
