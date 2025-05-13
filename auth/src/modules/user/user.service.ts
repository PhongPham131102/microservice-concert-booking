import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { Model } from 'mongoose';
import { SignUpDto } from '../auth/dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { StatusResponse } from 'src/enum/response.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async checkUsername(username: string) {
    const user = await this.userModel.findOne({ username, isDelete: false });
    return user;
  }
  async create(createUserDto: SignUpDto) {
    const { password } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);

    const alreadyUsername = await this.checkUsername(createUserDto?.username);
    if (alreadyUsername) {
      throw new HttpException(
        {
          status: StatusResponse.EXISTS_USERNAME,
          message: 'Already Exist Username!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });

    return {
      status: StatusResponse.SUCCESS,
      message: 'Create New User successfully',
      user,
    };
  }
  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username, isDelete: false });
    return user;
  }
  async checkPassword(password: string, hashPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashPassword);
    return isCorrectPassword;
  }
}
