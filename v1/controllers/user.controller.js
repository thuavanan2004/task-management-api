const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const sendEmailHelper = require("../../helpers/sendEmail.helper");
const generateHelper = require("../../helpers/generate.helper");

const loginValidate = require("../validates/login.validate");


// [POST] /users/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đăng ký đã tồn tại"
        })
        return;
    }
    const objUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        token: generateHelper.generateToken(30)
    }
    const user = new User(objUser)
    await user.save();
    res.json({
        code: 200,
        message: "Đăng ký tài khoản thành công!"
    })

}

// [POST] /users/login
module.exports.login = async (req, res) => {
    try {
        const result = loginValidate(req.body);
        if (result.error) {
            res.json({
                code: 400,
                message: "Định dạng không hợp lệ"
            })
        } else {

            const existUser = await User.findOne({
                email: result.value.email,
                deleted: false
            })

            if (!existUser) {
                res.json({
                    code: 400,
                    message: "Email không tồn tại!"
                })
                return;
            }
            if (existUser.password != md5(result.value.password)) {
                res.json({
                    code: 400,
                    message: "Mật khẩu không đúng!"
                })
                return;
            }
            res.json({
                code: 200,
                message: "Đăng nhập thành công!",
                token: existUser.token
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: error
        })
    }
}

// [POST] /users/password/forgot
module.exports.passwordForgot = async (req, res) => {
    const email = req.body.email;
    const existUser = await User.findOne({
        email: email,
        deleted: false
    })
    if (!existUser) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        })
        return;
    }

    // Lưu otp vào database
    const objectForgotPassword = {
        email: email,
        otp: generateHelper.generateNumber(6),
        expireAt: Date.now() + 3 * 60 * 1000
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    // Việc 2: Gửi mã OTP qua mail cho người dùng
    const subject = "Lấy lại mật khẩu.";
    const text = `Mã OTP xác thực tài khoản của bạn là: ${objectForgotPassword.otp}. Mã OTP có hiệu lực trong vòng 3 phút. Vui lòng không cung cấp mã OTP này với bất kỳ ai.`;
    sendEmailHelper.sendEmail(email, subject, text);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email!"
    })
}