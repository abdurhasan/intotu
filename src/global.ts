import { Config } from './helpers/config.helper';


export class Global {
    static isProduction(): boolean {
        return Config.get('APP_MODE') === 'production';
    }

    static encryptionSaltyKey(): string {
        return Config.get('ENCRYPTION_SALT_KEY') ? Config.get('ENCRYPTION_SALT_KEY') : 'Intotu2020!';
    }


}
