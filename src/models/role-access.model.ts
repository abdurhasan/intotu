import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('role_accesses')
export class TRoleAccess {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
    @Column({ name: 'roleId', nullable: false })
    roleId: number;
    @Column({ name: 'accessesId', nullable: false })
    accessId: number;
}
