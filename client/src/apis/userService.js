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

export const apiUpdateUser = (token, data) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await aixos({
                method: 'put',
                url: 'http://localhost:8081/api/teacher/update-teacher',
                headers: {
                    authorization: token,
                },
                data,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetStudent = (token) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await aixos({
                method: 'get',
                url: 'http://localhost:8081/api/student/get-student',
                headers: {
                    authorization: token,
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiUpdateStudent = (token, data) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await aixos({
                method: 'put',
                url: 'http://localhost:8081/api/student/update-student-profile',
                headers: {
                    authorization: token,
                },
                data,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
export const apiGetAssignmentOfStudent = (token, data) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await aixos({
                method: 'get',
                url: 'http://localhost:8081/api/student/get-assignment-of-student',
                headers: {
                    authorization: token,
                },
                data,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });