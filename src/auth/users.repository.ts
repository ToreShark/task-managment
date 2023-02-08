import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bycrpt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { phone, password } = authCredentialsDto;

    const salt = await bycrpt.genSalt();

    const hashedPassword = await bycrpt.hash(password, salt);

    // здесь должна быть логика ввода пароли с смс с другой БД

    const user = this.userRepository.create({
      phone,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Phone ${phone} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(phone: string): Promise<User> {
    const found = await this.userRepository.findOneBy({ phone });
    return found;
  }
}
