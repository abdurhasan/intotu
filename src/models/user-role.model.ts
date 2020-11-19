import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('user_roles')
export class TUserRole {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
    @Column({ name: 'userId', nullable: false })
    userId: number;
    @Column({ name: 'roleId', nullable: false })
    roleId: number;
}
