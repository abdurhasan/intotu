
import { Property, Required } from '@tsed/schema';
import { Gender } from '../models/user.model';

export class UpdateUserValidator {
    @Required()
    id: number;
    @Property()
    fullName: string;
    @Property()
    email: string;
    @Property()
    password: string;
    @Property()
    gender: Gender;
}

export class RegisterUserValidator {
    @Required()
    fullName: string;
    @Required()
    email: string;
    @Required()
    password: string;
    @Required()
    gender: Gender;
}