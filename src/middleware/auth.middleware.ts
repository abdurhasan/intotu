import { Middleware, Req, Res, Next } from "@tsed/common";
import { HTTPException } from "@tsed/exceptions";
import { getSaasConn } from '../database/db-config';
import { CacheComputing, Global } from '../global';
import { AuthService } from '../services/auth.service';

export const cacheToken = new CacheComputing('cache token', false);
@Middleware()
export class AuthMiddleware {
    constructor(
        private authService: AuthService,
    ) { }
    async use(@Req() req: any, @Res() res: any, @Next() next: any
    ) {
        try {

            const getPath: string = req.originalUrl.split("?").shift();

            if (!Global.isExcludeMiddleware(getPath)) {
                const token: string = req.header('Authorization') || req.query.accessToken || req.query.authorization;
                if (!token) {
                    throw new Error('Authorization Required')
                }
                if (!cacheToken.get(token)) {
                    cacheToken.set(token, await this.authService.getAuth(token));
                }
                req.userData = cacheToken.get(token);
                req.conn = await getSaasConn(req.userData.partnerCode);
            }

            next();
        } catch (e) {
            throw new HTTPException(401, e.message);
        }
    }

}
