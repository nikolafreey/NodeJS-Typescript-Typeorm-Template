import { User } from '../../entities/User';
import { myDataSource } from '../../utils/appDataSource';
import { IUser } from './user.interface';

class UserService {
  private userRepo = myDataSource.getRepository(User);

  public async test({ firstName, lastName }: any): Promise<IUser> {
    try {
      return (await this.userRepo
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([{ firstName, lastName }])
        .execute()) as unknown as IUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default UserService;
