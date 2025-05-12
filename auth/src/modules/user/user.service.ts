import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { Model } from 'mongoose';
import { SignUpDto } from '../auth/dto/signUp.dto';
import * as bcrypt from 'bcrypt';
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
    if (createUserDto?.email) {
      const alreadyEmail = await this.checkEmail(createUserDto?.email);

      if (alreadyEmail) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            message: 'Already Exist Email!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,

      role: new Types.ObjectId(createUserDto?.role),
    });

    const user = await this.userModel
      .findById(newUser?._id)
      .populate([{ path: 'role', select: 'name' }]);
    let token: string;
    let exists = true;

    while (exists) {
      token = crypto.randomBytes(32).toString('hex');
      exists = !!(await this.tokenModel.exists({ data: token }));
    }
    await this.tokenModel.create({
      email: user.email,
      data: token,
      owner: user._id,
    });
    const stringLog = `✅<b>Tạo mới tài khoản</b>✅\n\n${_user?.username ? `Người dùng ${_user?.username}` : 'Khách vãng lai'} vừa tạo mới 1 người dùng\n<b>Vào lúc</b>: ${moment(new Date()).format('HH:mm - DD/MM/YYYY')}\n<b>IP người thực hiện</b>: ${userIp}\n`;
    request['new-data'] =
      `Tên đăng nhập: ${user.username}\nTên: ${user.name}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.name || 'Trống'}\n`;
    request['message-log'] = stringLog;

    return {
      status: StatusResponse.SUCCESS,
      message: 'Create New User successfully',
      user,
    };
  }
}
