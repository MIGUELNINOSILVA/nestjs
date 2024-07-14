import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class UserService {
  async create(userDTO: UserDTO): Promise<IUser> {}
}
