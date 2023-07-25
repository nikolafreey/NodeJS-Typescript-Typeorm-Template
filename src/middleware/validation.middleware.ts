import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi from 'joi';

function validationMiddleware(
  schema: Joi.Schema,
  validateQueryParams?: boolean
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      if (validateQueryParams) {
        const value = await schema.validateAsync(req.query, validationOptions);
        req.query = value;
        next();
      } else {
        const value = await schema.validateAsync(req.body, validationOptions);
        req.body = value;
        next();
      }
    } catch (e: any) {
      const errors: string[] = [];
      e.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors: errors });
    }
  };
}

export default validationMiddleware;
