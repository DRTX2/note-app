import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() request: Request) {
    return request.user;
  }

  @Get('status')
  @UseGuards(JwtGuard)
  getStatus(@Req() req: Request) {
    console.log("Inside authController status method");
    return req.user;
  }
}
