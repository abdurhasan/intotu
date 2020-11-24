import { EndpointInfo, IMiddleware, Middleware, Req, Context, Res, Next } from "@tsed/common";
import { Forbidden, HTTPException, Unauthorized } from "@tsed/exceptions";


@Middleware()
export class AuthMiddleware {
    public use(@Req() req: any, @Res() res: any, @Next() next: any
    ) {
        try {
            if (!exludeAuth.includes(req.url)) {
                const token: string = req.header('Authorization') || req.query.accessToken || req.query.authorization;
                if (!token) {
                    throw new Error('Authorization Required')
                }
                // const auth = await getAuth(authorization, req);
                // req.auth = auth;

                // this.log(auth);
            }
            next();
        } catch (e) {
            throw new HTTPException(401, e.message);
        }
    }

}

const exludeAuth: string[] = [
    '/auth/login',
    '/auth/encrypting'
]