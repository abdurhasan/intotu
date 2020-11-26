import { BodyParams, Controller, PathParams, Post, QueryParams, Res } from '@tsed/common';
import { parseJson } from '../helpers';
import { doDecrypt, doEncrypt } from '../helpers/encryption.helper';
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

        } catch (e) {
            return responseError(e.message, 401)
        }

    }

    @Post('/encrypting/:isEncrypt')
    async encrypting(@PathParams('isEncrypt') isEncrypt: boolean, @BodyParams() body: any, @Res() res: any) {
        try {
            let data: any;
            if (isEncrypt) {
                data = doEncrypt(JSON.stringify(body.data))
            } else {
                data = parseJson(doDecrypt(body.data))
            }

            res.status(200)
            res.setHeader('Content-Type', 'application/json')
            res.send({ data })

        } catch (e) {
            throw e
        }

    }
}