const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.headers.authorization.split(" ")[1]) {
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm token!"
        })
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    const existUser = await User.findOne({
        token: token,
        deleted: false
    }).select("fullName email")

    if (!existUser) {
        res.json({
            code: 400,
            message: "Token không hợp lệ!"
        })
        return;
    }
    res.locals.user = existUser;
    next();
}