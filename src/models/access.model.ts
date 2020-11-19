import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('accesses')
export class TAccess {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
    @Column({ name: 'name', nullable: false })
    accessName: string;
}
