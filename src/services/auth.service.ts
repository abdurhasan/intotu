import { Injectable } from '@tsed/di';
import { LoginValidator } from '../inteface/login.validator';
import { getRepository } from 'typeorm';
import { IntotuPartner } from '../models/saas/intotu-partner.model';
import { $log as Logger } from "@tsed/common";
import { getSaasConn } from '../database/db-config';
import { TUser } from '../models/user.model';
import { doDecrypt } from '../helpers/encryption.helper';
import { TUserRole } from '../models/user-role.model';
import { TAccess } from '../models/access.model';
import { TRole } from '../models/role.model';
import { generateToken, ONE_DAY_MS, parseJson } from '../helpers';
import { AccessToken } from '../models/saas/AccessToken.model';
import { UserData } from '../inteface/index.interface';
import { classToPlain } from 'class-transformer';
import * as moment from 'moment';

@Injectable()
export class AuthService {

    constructor() { }

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
            const companyConn = await getSaasConn(partnerCode)
            const userOne = await companyConn.getRepository(TUser)
                .createQueryBuilder('user')
                .where('email = :email', { email })
                .leftJoinAndMapOne('user.getRole', TUserRole, 'tuserrole', 'user.id = tuserrole.userId')
                .leftJoinAndMapOne('user.getRoleName', TRole, 'trole', 'trole.id = tuserrole.roleId')
                .leftJoinAndMapMany('user.getAccess', TAccess, 'taccess', 'user.id = tuserrole.userId')
                .select([
                    'user.id',
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
            const getToken: string = generateToken(partnerCode, email);
            const plainUser: any = classToPlain(userOne);
            const role: string = plainUser['getRoleName']?.roleName;
            const access: string[] = plainUser['getAccess'].map((snap: { accessName: string }) => snap.accessName)
            const userData = new UserData({ ...plainUser, role, access, partnerCode })

            await getRepository(AccessToken)
                .createQueryBuilder()
                .insert()
                .values({
                    id: getToken,
                    createdAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                    userData: JSON.stringify(userData),
                    roleAuth: JSON.stringify({ role, access }),
                    ttl: Date.now() + ONE_DAY_MS,
                })
                .execute()

            return { userData, token: getToken }

        } catch (error) {
            Logger.error('AuthService.doLogin ', error.message)
            throw error
        }
    }

    validatePassword(currentPassword: string, encryptedPassword: string): boolean {
        Logger.info('AuthService.validatePassword')        
        return currentPassword === parseJson(doDecrypt(encryptedPassword));
    }

    async getAuth(token: string): Promise<UserData> {
        const tokenRepo = AccessToken.createQueryBuilder('accessToken')
        const accessToken = await tokenRepo
            .where('accessToken.id = :token', { token })
            .getOne()

        if (!accessToken) {
            throw new Error(`invalid authorization : ${token}`)
        }
        if (Date.now() > accessToken.ttl) {
            await tokenRepo
                .delete()
                .where('accessToken.id = :token', { token })
                .execute();

            throw new Error(`token : ${token} was expired`)
        }

        return new UserData(accessToken.confUserData)
    }

}

