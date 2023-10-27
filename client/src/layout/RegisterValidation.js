export default function Validation(values) {
    let error = {};

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/; //có ít nhất một chữ số, một ký tự viết thường, một ký tự viết hoa và có ít nhất 8 ký tự trong tổng số.

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
        error.password = 'Mật khẩu của bạn phải có ít nhất từ 8 ký tự bao gồm chữ số chữ HOA chữ THƯỜNG và SỐ';
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
