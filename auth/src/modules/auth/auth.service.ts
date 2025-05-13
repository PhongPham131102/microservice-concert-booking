import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { StatusResponse } from 'src/enum/response.enum';
import { SignInDto } from './dto/signIn.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto) {
    const { username } = body;

    const checkUserName = await this.userService.checkUsername(username);
    if (checkUserName)
      throw new HttpException(
        {
          status: StatusResponse.EXISTS_USERNAME,
          column: 'username',
          message: 'Username Already Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    const { user } = await this.userService.create(body);

    const data = {
      username: user.username,
      name: user.fullName,
    };
    return {
      status: StatusResponse.SUCCESS,
      messsage: 'Create An User Success',
      data,
    };
  }

  async signIn(_user: SignInDto) {
    const { username, password } = _user;
    const user = await this.userService.findByUsername(username);

    if (!user)
      throw new HttpException(
        {
          status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
          message: 'User Name Or Password Is Not Correct',
        },
        HttpStatus.BAD_REQUEST,
      );
    const checkPassword = await this.userService.checkPassword(
      password,
      user.password,
    );
    if (!checkPassword)
      throw new HttpException(
        {
          status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
          message: 'User Name Or Password Is Not Correct',
        },
        HttpStatus.BAD_REQUEST,
      );

    const payload = {
      username,
      user_id: user._id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const data = {
      username: user.username,
      name: user.fullName,
    };

    return {
      accessToken,
      userId: user._id,
      status: StatusResponse.SUCCESS,
      message: 'Login Success',
      data,
    };
  }
}
