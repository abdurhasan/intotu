import { Injectable } from '@tsed/di';
import { Connection, getRepository } from 'typeorm';
import { UpdateRoleAccess } from '../inteface/roles-access.validator';
import { RegisterUserValidator, UpdateUserValidator } from '../inteface/user-crud.validator';
import { cacheToken } from '../middleware/auth.middleware';
import { TAccess } from '../models/access.model';
import { TRoleAccess } from '../models/role-access.model';
import { TRole } from '../models/role.model';
import { AccessToken } from '../models/saas/AccessToken.model';
import { TUser } from '../models/user.model';
import { $log as Logger } from "@tsed/common";
import * as moment from 'moment';
import { doEncrypt } from '../helpers/encryption.helper';
@Injectable()
export class AdminService {

    constructor() { }

    async getUsers(conn: Connection): Promise<TUser[]> {
        return await conn.getRepository(TUser).createQueryBuilder().getMany()
    }

    async getAllRoleAccess(conn: Connection) {
        const getRoles = await conn
            .createQueryBuilder(TRole, 'role')
            .leftJoinAndMapMany('role.roleAccess', TRoleAccess, 'roleAccess', 'roleAccess.roleId = role.id')
            .leftJoinAndMapMany('role.access', TAccess, 'access', 'access.id = roleAccess.accessId')
            .select(['role', 'access'])
            .getMany()
        return getRoles
    }

    async updateUser(conn: Connection, params: UpdateUserValidator) {
        await conn.getRepository(TUser)
            .createQueryBuilder()
            .where('id = :id', { id: params.id })
            .update()
            .set({
                ...params,
                updatedAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            })
            .execute()

    }

    async getRoles(conn: Connection) {
        return await conn.getRepository(TRole)
            .createQueryBuilder()
            .getMany()
    }

    async updateRoleAccess(conn: Connection, params: UpdateRoleAccess): Promise<void> { // use transaction
        const storeRoleAcccess: TRoleAccess[] = [];

        const queryRunner = conn.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // #1 : update role
            await queryRunner.manager.getRepository(TRole).createQueryBuilder()
                .where('id = :id', { id: params.id })
                .update()
                .set({ roleName: params.roleName })
                .execute()
            // #2 : update access
            for (const oneAccess of params.access) {
                await queryRunner.manager.getRepository(TAccess).createQueryBuilder()
                    .where('id = :id', { id: oneAccess.id })
                    .update()
                    .set({ accessName: oneAccess.accessName })
                    .execute()

                storeRoleAcccess.push({ roleId: params.id, accessId: oneAccess.id })
            }

            // # 3 : delete before role access            
            await queryRunner.manager.getRepository(TRoleAccess).createQueryBuilder()
                .delete()
                .where('roleId = :roleId', { roleId: params.id })
                .execute()

            // # 4 : insert new role access
            await queryRunner.manager.getRepository(TRoleAccess).createQueryBuilder()
                .insert()
                .values(storeRoleAcccess)
                .execute()

            // # 5 : remove all accessToken
            await getRepository(AccessToken).createQueryBuilder().delete().execute()

            await queryRunner.commitTransaction();

        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            Logger.info('AdminService.updateRoleAccess is success')
            cacheToken.destroy()
            await queryRunner.release();
        }

    }

    async registerUser(conn: Connection, params: RegisterUserValidator) {
        return await conn.getRepository(TUser)
            .createQueryBuilder()
            .insert()
            .values({
                ...params,
                createdAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                password: doEncrypt(params.password)
            })
            .execute()
    }

}

