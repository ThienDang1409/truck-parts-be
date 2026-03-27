import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import {
  SignUpDto,
  SignInDto,
  AuthResponseDto,
  RefreshTokenDto,
  PreRegisterDto,
  CompleteRegisterDto,
  ChangePasswordDto,
  JwtPayload,
} from './dto/auth.dto';
import { Role as PrismaRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getAccessToken(user: { id: string; email: string; role: PrismaRole }) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: '15m' },
    );
  }

  private getRefreshToken(user: { id: string }) {
    return this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.usersService.create({
      email: signUpDto.email,
      password: hashedPassword,
      fullName: signUpDto.fullName,
      phone: signUpDto.phone,
      role: PrismaRole.USER,
    });

    const accessToken = this.getAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = this.getRefreshToken({ id: user.id });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is disabled');
    }

    const accessToken = this.getAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = this.getRefreshToken({ id: user.id });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = this.jwtService.verify<JwtPayload>(dto.refreshToken);
    const user = await this.usersService.findOne(payload.sub);
    if (!user || user.refreshToken !== dto.refreshToken) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const accessToken = this.getAccessToken({ id: user.id, email: user.email, role: user.role });
    return { tokens: { accessToken } };
  }

  async logout(userId: string) {
    const existing = await this.usersService.findOne(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.clearRefreshToken(userId);
    return;
  }

  async preRegister(preRegisterDto: PreRegisterDto) {
    const existingUser = await this.usersService.findByEmail(preRegisterDto.email);
    if (existingUser && existingUser.isActive) {
      throw new BadRequestException('Email already registered');
    }

    const token = Math.random().toString(36).substr(2, 24);

    if (existingUser) {
      await this.usersService.update(existingUser.id, { preRegisterToken: token, isActive: false });
      return { token };
    }

    const user = await this.usersService.create({
      email: preRegisterDto.email,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      fullName: '',
      role: PrismaRole.USER,
      isActive: false,
      preRegisterToken: token,
    });

    return { token };
  }

  async completeRegister(completeDto: CompleteRegisterDto) {
    const user = await this.usersService.findByPreRegisterToken(completeDto.token);
    if (!user) {
      throw new NotFoundException('Invalid registration token');
    }

    const hashedPassword = await bcrypt.hash(completeDto.password, 10);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      fullName: completeDto.fullName ?? user.fullName,
      phone: completeDto.phone ?? (user.phone ?? undefined),
      isActive: true,
      preRegisterToken: null,
    });

    return { success: true };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);
    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password invalid');
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    return this.usersService.update(userId, { password: hashedPassword });
  }
}

