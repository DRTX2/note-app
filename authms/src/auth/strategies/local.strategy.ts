import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService:AuthService){super();}
    validate(username: string, password: string): any {
        console.log("Inside local Strategy");
        
        const user = this.authService.validateUser({ username, password });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}