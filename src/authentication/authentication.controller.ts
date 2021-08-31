import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { SmsApiEnum } from 'src/sms/enums/sms-api.enum';
import { UserErrorEnum } from 'src/users/enums/user-message.enum';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { LinearRegisterDto } from './dto/linear-register.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyRegisterDto } from './dto/verify-register.dto';
import { AuthenticationErrorEnum } from './enums/authentication-message.enum';

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

      const code = await this.authenticationService.cachePhone(phone);
      console.log(code);
      
      //FIXME: sms panel needed
      // const sentSuccessful = await this.authenticationService.sendVerification(
      //     phone,
      //     SmsApiEnum.VERIFICATION_TEMPLATE_ID,
      //     code
      //     );

      // if(!sentSuccessful) {
      //     ResponseDto.error(AuthenticationErrorEnum.SMS_SERVICE_NOT_WORK, 501);
      // }

      return ResponseDto.success({ phone });

  }

  @ApiOperation({ summary: 'Verify phone number using the code sent' })
  @Post('verify-register')
  async verifyRegister(@Body() { phone, code }: VerifyRegisterDto) {

      const verified = await this.authenticationService.verifyCode(phone, code);
      if(!verified) return ResponseDto.error(
          AuthenticationErrorEnum.VERIFICATION_INCORRECT_CODE,
          403
          )
      
      await this.authenticationService.deleteVerificationCode(phone)

      const token = await this.authenticationService.generateForceToken(phone);

      return ResponseDto.success({ force_token: token });
  }

  @ApiOperation({ summary: 'Fill the fields and complete the registration' })
  @Post('register')
  async register(@Body() { phone, password, force_token }: RegisterDto) {

    const verified = await this.authenticationService.verifyForceToken(phone, force_token);
    if(!verified) return ResponseDto.error(
        AuthenticationErrorEnum.FORCE_TOKEN_INVALID,
        401
        )

    await this.authenticationService.deleteForceToken(phone)
    
    const userIns = await this.usersService.create({ phone, password })

    return ResponseDto.success(userIns.toJSON());

  }
}
