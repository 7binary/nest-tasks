import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const {username, password} = authCredentialsDto;

    const user = new User({username});
    await user.generatePasshash(password);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username is already taken');
      }
      throw new InternalServerErrorException();
    }

    return user;
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User|null> {
    const {username, password} = authCredentialsDto;
    const user: User|undefined = await this.findOne({username});

    return user && await user.validatePassword(password) ? user : null;
  }

  async getTestUser(username: string, password: string): Promise<User> {
    let testUser: User|undefined = await User.findOne({username});

    if (!testUser) {
      testUser = new User({username});
      await testUser.generatePasshash(password);
      await testUser.save();
    }

    return testUser;
  }
}