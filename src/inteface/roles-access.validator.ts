
import { Required } from '@tsed/schema';
import { TAccess } from '../models/access.model';


export class UpdateRoleAccess {
    @Required()
    id: number;
    @Required()
    roleName: string;
    @Required()
    access: TAccess[];
}