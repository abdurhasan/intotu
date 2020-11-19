import { Controller, Get, Res } from "@tsed/common";
import { Returns } from '@tsed/schema';
import { UserService } from '../services/user.service';

@Controller("/user")
export class UserController {
  constructor(
    private userService: UserService,
  ) { }
  @Get("/")
  @Returns(200,'')
  get(@Res() res : any) {
    const helloUser = this.userService.getHello()

    res.setHeader('Content-Type', 'application/json')
    res.send(helloUser)
  }
  @Get("/login")
  doLogin() {
    return { heii: 'its login' }
  }
}
