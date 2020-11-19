import { Injectable } from '@tsed/di';
import { doEncrypt, doDecrypt } from '../helpers/encryption.helper';



@Injectable()
export class UserService {

    getHello() {
        // const dbPartner = `1wBsUtAvOFMlSsS+j3zDlNASdW8gHr7MQ1qZw4SN6eJOYNqxEExfNc11urYgrgDFNbO6QS2bBhvBuMG5c0ro/m1nht3OqdgAHw6UV45sehbX/SgRigOUbZHBXAR+8erkU3hLnFZH25oeHR0IUhNX3YcEQ6TZ1Ubwleh9IzyuffTmk/CHeW45xLBkkVMRSC7L+VDsKoUqmSdH5GmIjqMpLLFBhhLVKh2ImXCGpFkaahjjaoVSMyJWUapCk7n/IXNEZ/FPDFG0ArqFp9Ga0tyPjADJ4kTTBM0F`
        const dbPartner = {

            host: 'sql7.freemysqlhosting.net',
            port: 3306,
            username: 'sql7377033',
            password: '94EV8qqVfa',
            database: 'sql7377033',
            logging: false,
            synchronize: false,
            entities: [`../models/*{.ts,.js}`]

        }
        return {
            dor: doEncrypt(JSON.stringify(dbPartner))
        }


    }

}