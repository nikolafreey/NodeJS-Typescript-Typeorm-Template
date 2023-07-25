import { NextFunction, Request, Response, Router } from 'express';
import { t } from 'i18next';
import validationMiddleware from '../../middleware/validation.middleware';
import HttpException from '../../utils/exceptions/http.exception';
import Controller from '../../utils/interfaces/controller.interface';
import UserService from './user.service';
import validate from './user.validation';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(
      `${this.path}/test`,
      validationMiddleware(validate.test, true),
      this.test
    );
  }

  private test = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { firstName, lastName } = req.query;

      console.log('firstName', firstName, 'lastName', lastName);

      const data = await this.UserService.test({ firstName, lastName });

      res.status(201).json({ data });
    } catch (error) {
      next(new HttpException(400, t('userControllerTestError')));
    }
  };
}

export default UserController;
