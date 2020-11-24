
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';


@Entity('AccessToken')
export class AccessToken extends BaseEntity {
    @PrimaryColumn({ name: 'id' })
    id: string;
    @Column({ name: 'createdAt' })
    createdAt: Date;
    @Column({ name: 'userData' })
    userData: string;
    @Column({ name: 'roleAuth' })
    roleAuth: string;
    @Column({ name: 'ttl' })
    ttl: number;
}
