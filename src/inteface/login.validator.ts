import { Required } from '@tsed/schema';



export class LoginValidator {
    @Required()
    partnerCode: string;
    @Required()
    email: string
    @Required()
    password: string
}