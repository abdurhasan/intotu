import { Injectable } from '@tsed/di';
import { Connection } from 'typeorm';
import { groupBy } from '../helpers';
import { TAccess } from '../models/access.model';
import { TRoleAccess } from '../models/role-access.model';
import { TRole } from '../models/role.model';
import { TUserRole } from '../models/user-role.model';
import { TUser } from '../models/user.model';


@Injectable()
export class AdminService {

    constructor() { }

    async getUsers(conn: Connection): Promise<TUser[]> {
        return await conn.getRepository(TUser).createQueryBuilder().getMany()
    }

    async getRoles(conn: Connection) {
        const getRoles = await conn
            .createQueryBuilder(TRole, 'role')
            .leftJoinAndMapMany('role.roleAccess', TRoleAccess, 'roleAccess', 'roleAccess.roleId = role.id')
            .leftJoinAndMapMany('role.access', TAccess, 'access', 'access.id = roleAccess.accessId')
            .select(['role', 'access'])
            .getMany()
        return getRoles
    }

}

