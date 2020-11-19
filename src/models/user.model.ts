import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')
export class TUser {


    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'fullName' })
    fullName: string;
    @Column({ name: 'email' })
    email: string;
    @Column({ name: 'password' })
    password: string;
    @Column({ name: 'gender' })
    gender: Gender;
    @Column({ name: 'createdAt' })
    createdAt: string;
    @Column({ name: 'updatedAt' })
    updatedAt: string;

}


enum Gender {
    male = 'male',
    female = 'female'
}