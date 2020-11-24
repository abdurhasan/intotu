

export class UserData {
    email: string;
    fullName: string;
    gender: string;
    role: string;
    access: string[]
    constructor(partial: Partial<UserData>) {
        this.email = partial?.email || ''
        this.fullName = partial?.fullName || ''
        this.gender = partial?.gender || ''
        this.role = partial?.role || ''
        this.access = partial?.access || []

        // Object.assign(this, partial);
    }
}