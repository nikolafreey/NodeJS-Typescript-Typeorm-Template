import Joi from 'joi';

const test = Joi.object({
  firstName: Joi.string().required(),

  lastName: Joi.string().required(),
});

export default { test };
