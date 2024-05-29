const Task = require("../models/task.model")
const changeStatusValidate = require("../validates//changeStatus.validate");
const taskValidate = require("../validates/task.validate");


// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // Lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    // Sắp xếp 
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // Phân trang
    const pagination = {
        limit: 2,
        page: 1
    }
    if (req.query.page) {
        pagination.page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        pagination.page = parseInt(req.query.limit);
    }
    skip = (pagination.page - 1) * pagination.limit;
    // Tìm kiếm
    if (req.query.keyWord) {
        const regex = new RegExp(req.query.keyWord);
        find.title = regex;
    }

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(pagination.limit)
        .skip(skip)

    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    });

    res.json(task)
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const result = changeStatusValidate(req.body.status);
        if (result.error) {
            res.json({
                code: 400,
                message: result.error.message
            })
        } else {
            const id = req.params.id;
            await Task.updateOne({
                _id: id
            }, {
                status: result.value
            });

            res.json({
                code: 200,
                message: "Cập nhật trạng thái thành công!"
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại bản ghi!"
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi/
module.exports.changeMulti = async (req, res) => {
    try {
        const result = changeStatusValidate(req.body.status);
        if (result.error) {
            // res.status(400).json(result.error.message);
            res.json({
                code: 400,
                message: "Trạng thái thay đổi không hợp lệ!"
            })
        } else {
            await Task.updateMany({
                _id: {
                    $in: req.body.ids
                }
            }, {
                status: result.value
            })
            res.json({
                code: 200,
                message: "Thay đổi trạng thái sản phẩm thành công!"
            })
        }


    } catch {
        res.json({
            code: 400,
            message: "Thay đổi trạng thái sản phẩm không thành công!"
        })
    }

}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        const result = taskValidate(req.body);
        if (result.error) {
            res.json({
                code: 400,
                message: result.error.message
            })
        } else {
            const task = new Task(result.value);
            await task.save();
            res.json({
                code: 200,
                message: "Tạo mới công việc thành công!"
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: error
        })
    }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const result = taskValidate(req.body);
        if (result.error) {
            res.json({
                code: 400,
                message: result.error.message
            })
        } else {
            const id = req.params.id;
            await Task.updateOne({
                _id: id,
                deleted: false
            }, result.value)

            res.json({
                code: 200,
                message: "Chỉnh sửa công việc thành công!"
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: error
        })
    }
}

// [POST] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        })
        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm không thành công! error: " + error
        })
    }
}
// [POST] /api/v1/tasks/delete-multi
module.exports.deleteMulti = async (req, res) => {
    try {
        const ids = req.body.ids;
        await Task.updateMany({
            _id: {
                $in: ids
            }
        }, {
            deleted: true,
            deletedAt: new Date()
        })
        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại" + error
        })
    }
}