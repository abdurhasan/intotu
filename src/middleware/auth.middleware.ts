import { Middleware, Req, Res, Next } from "@tsed/common";
import { HTTPException } from "@tsed/exceptions";
import { $log as Logger } from "@tsed/common";
import { getSaasConn } from '../database/db-config';
import { CacheComputing, Global } from '../global';
import { UserData } from '../inteface/index.interface';
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
            const originalUrl: any = req.originalUrl;
            const getPath: string = originalUrl.split("?").shift();

            if (!Global.isExcludeMiddleware(getPath)) {
                const token: string = req.header('Authorization') || req.query.accessToken || req.query.authorization;
                if (!token) {
                    throw new Error('Authorization Required');
                }
                if (!cacheToken.get(token)) {
                    cacheToken.set(token, await this.authService.getAuth(token));
                }
                const userData: UserData = cacheToken.get(token);
                Logger.info('userData : ', userData);

                if (!this.canAccess(originalUrl, userData.access)) {
                    throw new Error('You are not allowed')
                }
                req.conn = await getSaasConn(userData.partnerCode)
                next()

            } else {
                next();
            }

        } catch (e) {
            throw new HTTPException(401, e.message);
        }
    }

    canAccess(url: string, accessList: string[]): boolean {
        const rootUrl: string = url.split('/')[1];
        return accessList.includes(rootUrl);
    }

}
