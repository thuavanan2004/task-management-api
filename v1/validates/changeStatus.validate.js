const Joi = require('joi');


const taskSchema = Joi.string().valid('initial', 'doing', 'finish', 'pending').required();


const validateTask = (taskData) => {
    return taskSchema.validate(taskData);
};

module.exports = validateTask;