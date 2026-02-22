import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateUserDto } from './users.dto';
import { Users } from './users.entity';

@Controller()
export class AppController {
    constructor(private readonly userservice: AppService) { }

    // Root endpoint - health check
    @Get()
    health(): { status: string; message: string } {
        return { status: 'ok', message: 'HMS API is running' };
    }

    // Users controller routes
    @Get('users/db')
    async checkdatabase(): Promise<string> {
        return await this.userservice.checkdb();
    }

    @Post('users/users')
    async insert(@Body() body: { name: string; email: string }): Promise<Users> {
        return await this.userservice.insert(body);
    }

    @Get('users/display')
    async findAll(): Promise<Users[]> {
        return await this.userservice.findAll();
    }

    @Get('users/:id')
    findOne(@Param('id') id: string): Promise<Users> {
        return this.userservice.findOne1(+id);
    }

    // Update user
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<Users> {
        return this.userservice.update(+id, updateUserDto);
    }

    // Delete user
    @Delete(':id')
    delete(@Param('id') id: string): Promise<{ message: string }> {
        return this.userservice.delete(+id);
    }
}
