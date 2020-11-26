import { BodyParams, Controller, Get, Post, Req, Res } from '@tsed/common';
import { Connection } from 'typeorm';
import { HttpStatus } from '../helpers';
import { UpdateRoleAccess } from '../inteface/roles-access.validator';
import { RegisterUserValidator, UpdateUserValidator } from '../inteface/user-crud.validator';
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
            const data = await this.adminService.getAllRoleAccess(conn);
            res.json({ success: true, data })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }
    }

    @Get("/getRoles")
    async getRoles(@Req() req: any, @Res() res: any) {
        try {
            const conn: Connection = req.conn;
            const data = await this.adminService.getRoles(conn);
            res.json({ success: true, data })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }

    }

    @Post("/updateUser")
    async updateUser(@Req() req: any, @Res() res: any, @BodyParams() params: UpdateUserValidator) {
        try {
            const conn: Connection = req.conn;
            await this.adminService.updateUser(conn, params);
            res.json({ success: true, data: params })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }

    }

    @Post("/registerUser")
    async registerUser(@Req() req: any, @Res() res: any, @BodyParams() params: RegisterUserValidator) {
        try {
            const conn: Connection = req.conn;
            await this.adminService.registerUser(conn, params);
            res.json({ success: true, data: params })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }

    }

    @Post("/updateRoleAccess")
    async updateRoleAccess(@Req() req: any, @Res() res: any, @BodyParams() params: UpdateRoleAccess) {
        try {
            const conn: Connection = req.conn;
            await this.adminService.updateRoleAccess(conn, params);
            res.json({ success: true, data: params })

        } catch (e) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY)
            res.json({ success: false, message: e.message })
        }
    }

}