export default function Validation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*[a-z]).{8,}$/;

    if (values.email === '') {
        error.email = 'Email không được để trống';
    } else if (!email_pattern.test(values.email)) {
        error.email = 'Email của bạn không đúng định dạng!';
    } else {
        error.email = '';
    }
    if (values.password === '') {
        error.password = 'Mật khẩu không được để trống';
    } else if (!password_pattern.test(values.password)) {
        error.password = 'Mật khẩu của bạn phải có ít nhất từ 8 ký tự bao gồm chữ THƯỜNG ';
    } else {
        error.password = '';
    }
    if (values.confirm_password === '' || String(values.confirm_password) !== String(values.password)) {
        console.log(values.confirm_password + '___' + values.password);
        error.confirm_password = 'Mật khẩu của bạn không khớp . Nhập lại !!';
    } else {
        error.confirm_password = '';
    }

    return error;
}
