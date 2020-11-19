import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
    static get(key: string): string {
        const valStr = process.env[key]
        return valStr ? valStr : '';
    }

    static getNumber(key: string): number {
        return Number(process.env[key])
    }

    static getBoolean(key: string): boolean {
        return process.env[key] === 'true';
    }

    // static getMultiLine(key: string){
    //     try {
    //         return process.env[key].replace(/\\n/g, '\n');
    //     } catch (e) {
    //         return null;
    //     }
    // }

    // static getObject<T>(key: string): T {
    //     try {
    //         return JSON.parse(process.env[key]) as T;
    //     } catch (e) {
    //         return null;
    //     }
    // }

    // static getArray(key: string): string[] {
    //     if (!process.env[key]) return [];
    //     try {
    //         return process.env[key].split(',');
    //     } catch (e) {
    //         return [];
    //     }
    // }
}
