import { Injectable } from '@tsed/di';
import { Connection } from 'typeorm';
import { doEncrypt, doDecrypt } from '../helpers/encryption.helper';
import { CreateArticleValidator, UpdateArticleDto } from '../inteface/articles.validator';
import { UserData } from '../inteface/index.interface';
import { TArticle } from '../models/article.model';
import * as moment from 'moment';


@Injectable()
export class UserService {

    async getUserArticles(conn: Connection, userId: number): Promise<TArticle[]> {
        try {
            const articles = await conn.getRepository(TArticle)
                .createQueryBuilder('article')
                .where('article.userId = :userId', { userId })
                .select([
                    'article.id AS articleId',
                    'article.title AS title',
                    'article.body AS body',
                ])
                .getRawMany()

            return articles;

        } catch (error) {
            throw error
        }
    }

    async createArticle(conn: Connection, userId: number, params: CreateArticleValidator) {
        await conn.getRepository(TArticle)
            .createQueryBuilder()
            .insert()
            .values({
                ...params,
                userId,
                createdAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            })
            .execute()
    }

    async updateArticle(conn: Connection, userId: number, params: UpdateArticleDto): Promise<void> {
        try {
            const updateObj: any = new Object();
            if (params.body) updateObj['body'] = params.body;
            if (params.title) updateObj['title'] = params.title;

            await conn.getRepository(TArticle)
                .createQueryBuilder()
                .where('id = :articleId', { articleId: params.articleId })
                .andWhere('userId = :userId', { userId })
                .update()
                .set({
                    ...updateObj,
                    updatedAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                })
                .execute()

        } catch (error) {
            throw error;
        }
    }

}