
import { HTTPException } from '@tsed/exceptions';

export const responseError = (message: string, code: number = 400) => {
    return Promise.reject(new HTTPException(code, message));
};
