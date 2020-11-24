import { Injectable } from '@tsed/di';
import { LoginValidator } from '../inteface/login.validator';
import { Connection, createConnection, getRepository } from 'typeorm';
import { IntotuPartner } from '../models/saas/intotu-partner.model';
import { $log as Logger } from "@tsed/common";
import { getSaasConn } from '../database/db-config';
import { TUser } from '../models/user.model';
import { doDecrypt } from '../helpers/encryption.helper';
import { TUserRole } from '../models/user-role.model';
import { TAccess } from '../models/access.model';
import { TRole } from '../models/role.model';
import { generateToken } from '../helpers';
import { AccessToken } from '../models/saas/AccessToken.model';
import { UserData } from '../inteface/index.interface';
import { classToPlain } from 'class-transformer';

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
                .createQueryBuilder('user')
                .where('email = :email', { email })
                .leftJoinAndMapOne('user.getRole', TUserRole, 'tuserrole', 'user.id = tuserrole.userId')
                .leftJoinAndMapOne('user.getRoleName', TRole, 'trole', 'trole.id = tuserrole.roleId')
                .leftJoinAndMapMany('user.getAccess', TAccess, 'taccess', 'user.id = tuserrole.userId')
                .select([
                    'user.fullName',
                    'user.email',
                    'user.password',
                    'user.gender',
                    'trole.roleName',
                    'taccess.accessName',
                ])
                .getOne()


            if (!userOne || !this.validatePassword(password, userOne?.password)) {
                throw new Error('email or password is wrong!')
            }
            const getToken: string = generateToken(partnerCode, email)
            const plainUser: any = classToPlain(userOne)
            const role: string = plainUser['getRoleName']?.roleName
            const access: string[] = plainUser['getAccess'].map((snap: { accessName: string }) => snap.accessName)
            const userData = new UserData({ ...plainUser, role, access })

            await getRepository(AccessToken)
                .createQueryBuilder()
                .insert()
                .values({
                    id: getToken,
                    createdAt: new Date(),
                    userData: JSON.stringify(userData),
                    roleAuth: JSON.stringify({ role, access })
                })
                .execute()

            return { userData, token: getToken }

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
        return currentPassword === JSON.parse(doDecrypt(encryptedPassword));
    }
}

