import { BodyParams, Controller, Post, Res } from '@tsed/common';
import { responseError } from '../helpers/response.helper';
import { LoginValidator } from '../inteface/login.validator';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }
    @Post('/login')
    async doLogin(@BodyParams() paramLogin: LoginValidator, @Res() res: any) {
        try {
            const serviceLogin = await this.authService.doLogin(paramLogin)

            res.status(200)
            res.setHeader('Content-Type', 'application/json')
            res.send(serviceLogin)

        } catch {
            return responseError('Invalid credentials', 401)
        }

    }
}