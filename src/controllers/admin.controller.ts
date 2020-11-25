import { Controller, Get, Req, Res } from '@tsed/common';
import { Connection } from 'typeorm';
import { HttpStatus } from '../helpers';
import { AdminService } from '../services/admin.service';



@Controller("/admin")
export class AdminController {
    constructor(
        private adminService: AdminService,
    ) { }
    @Get("/getAllUser")
    async getAllUser(@Req() req: any, @Res() res: any) {
        try {
            const conn: Connection = req.conn;
            const data = await this.adminService.getUsers(conn);
            res.json({ success: true, data })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }

    }

    @Get("/getAllRoleAccess")
    async getAllRole(@Req() req: any, @Res() res: any) {
        try {
            const conn: Connection = req.conn;
            const data = await this.adminService.getRoles(conn);
            res.json({ success: true, data })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }

    }

}