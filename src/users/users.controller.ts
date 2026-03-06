import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Req,
  UseGuards
} from '@nestjs/common';

import * as bcrypt from "bcrypt";

import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UnauthorizedException } from '@nestjs/common';
import { generateToken } from '../auth/jwt.util';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.usersService.createUser(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {

    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException("Invalid password");
    }

    const token = generateToken(user.id);

    return {
      accessToken: token
    };
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req) {

    const userId = req.user.userId;

    return this.usersService.findById(userId);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {

    const userId = req.user.userId;

    return this.usersService.updateProfile(userId, dto);
  }

}