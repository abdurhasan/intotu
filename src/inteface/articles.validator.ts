import { Allow, Property, Required } from '@tsed/schema';



export class CreateArticleValidator {
    @Required()
    title: string;
    @Required()
    body: string;
}

export class UpdateArticleDto {
    @Required()
    articleId: number;
    @Property()
    title: string;
    @Property()
    body: string;
}
