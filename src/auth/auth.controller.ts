import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  AuthResponseDto,
  RefreshTokenDto,
  ChangePasswordDto,
  PreRegisterDto,
  CompleteRegisterDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role as PrismaRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('admin/signin')
  async signInAdmin(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    const auth = await this.authService.signIn(signInDto);
    if (auth.role !== PrismaRole.ADMIN) {
      throw new ForbiddenException('Forbidden');
    }
    return auth;
  }

  @Post('service/auth/jwt/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return { user: { id: req.user.userId, email: req.user.email, role: req.user.role } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.userId);
    return { message: 'Logged out' };
  }

  @Post('pre-register')
  async preRegister(@Body() preRegisterDto: PreRegisterDto) {
    const result = await this.authService.preRegister(preRegisterDto);
    return { data: result };
  }

  @Post('complete-register')
  async completeRegister(@Body() completeRegisterDto: CompleteRegisterDto) {
    const result = await this.authService.completeRegister(completeRegisterDto);
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(req.user.userId, dto);
    return { data: { message: 'Password changed' } };
  }
}

@Controller('auth-service/auth')
export class AuthServiceController {
  constructor(private authService: AuthService) {}

  @Post('jwt/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}

