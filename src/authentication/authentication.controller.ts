import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { UserErrorEnum } from 'src/users/enums/user-message.enum';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { LinearRegisterDto } from './dto/linear-register.dto';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    ) {}

  @ApiOperation({ summary: 'Send verification code to phone number' })
  @Post('linear-register')
  async linearRegister(@Body() { phone }: LinearRegisterDto) {

      const isDuplicated = await this.usersService.findByPhone(phone);
      if(isDuplicated) {
        return ResponseDto.error(UserErrorEnum.PHONE_DUPLICATION, 409)
      }
      await this.authenticationService.cachePhone(phone);
      const sentSuccessful = await this.authService.sendVerification(
          body.phone_number,
          SmsApiEnum.VERIFICATION_TEMPLATE_ID,
          SmsApiEnum.VERIFICATION_TEMPLATE_TYPE
          );
      if(!sentSuccessful) {
          throw new HttpException(AuthErrorEnum.SMS_SERVICE_NOT_WORK, 501);
      }
      return ResponseDto.success(body, AuthSuccessEnum.VERIFICATION_CODE_SENT);

  }
}
