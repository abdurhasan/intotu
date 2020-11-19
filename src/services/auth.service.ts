import { Injectable } from '@tsed/di';
import { LoginValidator } from '../inteface/login.validator';
import { Connection, createConnection, getRepository } from 'typeorm';
import { IntotuPartner } from '../models/saas/intotu-partner.model';
import { $log as Logger } from "@tsed/common";
import { getSaasConn } from '../database/db-config';
import { TUser } from '../models/user.model';
import { doDecrypt } from '../helpers/encryption.helper';
import { TUserRole } from '../models/user-role.model';
@Injectable()
export class AuthService {

    constructor() {

    }


    async doLogin(params: LoginValidator) {

        try {
            const { partnerCode, email, password } = params;
            const getPartner = await getRepository(IntotuPartner)
                .createQueryBuilder('partner')
                .where('partner.partnerCode = :partnerCode', { partnerCode: partnerCode })
                .getOne()

            if (!getPartner) {
                throw new Error('partner tidak ditemukan')
            }

            const companyConn = (await getSaasConn(getPartner.confSHData)).manager

            const userOne = await companyConn.getRepository(TUser)
                .createQueryBuilder()
                // .leftJoin(TUserRole,'userRole')
                .where('email = :email', { email })
                .getOne()
            return userOne
            // if (!userOne || this.validatePassword(password, userOne?.password)) {
            //     throw new Error('email or password is wrong!')
            // }


            return userOne


        } catch (error) {
            Logger.error('AuthService.doLogin ', error.message)
            throw error
        }




    }

    // async getAccessAuth(conn: Connection, userId: number) {
    //     const result = {
    //         'admin': ['dashboard', 'articles', 'menu']
    //     }
    // }

    validatePassword(currentPassword: string, encryptedPassword: string): boolean {
        console.log(doDecrypt(encryptedPassword))
        console.log(currentPassword)
        return currentPassword === doDecrypt(encryptedPassword);
    }
}

