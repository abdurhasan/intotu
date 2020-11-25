

export class UserData {
    id: number;
    email: string;
    fullName: string;
    gender: string;
    role: string;
    access: string[];
    partnerCode: string;
    constructor(partial: Partial<UserData>) {
        this.id = partial?.id || 0;
        this.email = partial?.email || '';
        this.fullName = partial?.fullName || '';
        this.gender = partial?.gender || '';
        this.role = partial?.role || '';
        this.access = partial?.access || [];
        this.partnerCode = partial?.partnerCode || '';
    }
}

export class IExposeUserData {          // userData which can read by client ( frontend ) due to security issue    
    email: string;
    fullName: string;
    gender: string;
    role: string;
    partnerCode: string;
    constructor(partial: Partial<UserData>) {
        this.email = partial?.email || '';
        this.fullName = partial?.fullName || '';
        this.gender = partial?.gender || '';
        this.role = partial?.role || '';
        this.partnerCode = partial?.partnerCode || '';
    }
}

