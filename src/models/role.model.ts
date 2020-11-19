import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('roles')
export class TRole {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
    @Column({ name: 'name', nullable: false })
    roleName: string;
}
