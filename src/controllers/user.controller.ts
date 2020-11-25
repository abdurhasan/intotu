import { BodyParams, Controller, Get, Post, Req, Res } from "@tsed/common";
import { UserData } from '../inteface/index.interface';
import { Connection } from 'typeorm';
import { HttpStatus } from '../helpers';
import { IExposeUserData } from '../inteface/index.interface';
import { UserService } from '../services/user.service';
import { CreateArticleValidator, UpdateArticleDto } from '../inteface/articles.validator';

@Controller("/user")
export class UserController {
  constructor(
    private userService: UserService,
  ) { }

  @Get("/me")
  get(@Req() req: any, @Res() res: any) {
    const clientUserData = new IExposeUserData(req.userData)
    res.json({ success: true, data: clientUserData })
  }

  @Get("/myArticles")
  async getMyArticles(@Req() req: any, @Res() res: any) {
    try {
      const { conn, userData }: { conn: Connection, userData: UserData } = req;
      const data = await this.userService.getUserArticles(conn, userData.id)
      res.json({ success: true, data })

    } catch (e) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY)
      res.json({ success: false, message: e.message })
    }
  }

  @Post("/createArticle")
  async createArticle(@Req() req: any, @Res() res: any, @BodyParams() params: CreateArticleValidator) {
    try {

      const { conn, userData }: { conn: Connection, userData: UserData } = req;
      await this.userService.createArticle(conn, userData.id, params);
      res.json({ success: true, data: params })

    } catch (e) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY)
      res.json({ success: false, message: e.message })
    }
  }

  @Post("/updateArticle")
  async updateArticle(@Req() req: any, @Res() res: any, @BodyParams() params: UpdateArticleDto) {
    try {

      const { conn, userData }: { conn: Connection, userData: UserData } = req;
      await this.userService.updateArticle(conn, userData.id, params);
      res.json({ success: true, data: params })

    } catch (e) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY)
      res.json({ success: false, message: e.message })
    }
  }

}
