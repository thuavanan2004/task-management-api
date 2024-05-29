const Joi = require("joi");

const taskSchema = Joi.object({
    title: Joi.string(),
    status: Joi.string().valid('initial', 'doing', 'finish', 'pending'),
    content: Joi.string(),
    timeStart: Joi.date(),
    timeFinish: Joi.date().greater(Joi.ref('timeStart'))
});

const taskValidate = (taskData) => {
    return taskSchema.validate(taskData);
}

module.exports = taskValidate;