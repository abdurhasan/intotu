import { ONE_DAY_MS } from './helpers';
import { Config } from './helpers/config.helper';

const excludeMiddleware: string[] = [
    '/auth/login',
    '/auth/encrypting/true',
    '/auth/encrypting/false',
]

export class Global {

    static isExcludeMiddleware(route: string) {
        return excludeMiddleware.includes(route)
    }
    static isProduction(): boolean {
        return Config.get('APP_MODE') === 'production';
    }

    static encryptionSaltyKey(): string {
        return Config.get('ENCRYPTION_SALT_KEY') ? Config.get('ENCRYPTION_SALT_KEY') : 'Intotu2020!';
    }
}

export class CacheComputing {
    public cacheName: string;
    private cacheArray: boolean;
    private memoryCache: any;

    constructor(cacheName: string, cacheArray: boolean) {
        this.cacheName = cacheName;
        this.cacheArray = cacheArray;
        const self = this;
        setInterval(() => {
            console.log(`clearing : ${self.cacheName} `, self.memoryCache); // Logger
            self.memoryCache = self.cacheArray ? new Array() : new Object();
        }, ONE_DAY_MS);
    }

    public get(key: string): any {
        return this.memoryCache && this.memoryCache.hasOwnProperty(key)
            ? this.memoryCache[key]
            : null;
    }

    public set(key: string, value: any): void {
        if (!this.memoryCache) {
            this.memoryCache = this.cacheArray ? new Array() : new Object();
        }

        if (this.cacheArray) {
            this.memoryCache.push(value);
        } else {
            this.memoryCache[key] = value;
        }
    }
    public remove(key: any) {
        if (this.cacheArray) {
            this.memoryCache = this.memoryCache.filter(
                (snap: { hasOwnProperty: (arg0: any) => any; }) => snap !== key && !snap.hasOwnProperty(key),
            );
        } else {
            if (Array.isArray(key)) {
                for (let index = 0; index < key.length; index++) {
                    delete this.memoryCache[key[index]];
                }
            } else {
                delete this.memoryCache[key];
            }
        }
    }

    public destroy() {
        this.memoryCache = this.cacheArray ? new Array() : new Object();
    }
}
