import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('articles')
export class TArticle {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
    @Column({ name: 'userId' })
    userId: number;
    @Column({ name: 'title' })
    title: string;
    @Column({ name: 'body' })
    body: string;
    @Column({ name: 'createdAt' })
    createdAt: string;
    @Column({ name: 'updatedAt' })
    updatedAt: string;
}
