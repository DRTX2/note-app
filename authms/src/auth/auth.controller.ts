import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() request: Request) {
    return this.authService.login(request.user as AuthPayloadDto);
  }

  @Get('status')
  @UseGuards(JwtGuard)
  getStatus(@Req() req: Request) {
    return req.user;
  }
}
