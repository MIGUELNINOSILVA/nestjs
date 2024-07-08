import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from 'src/config/prisma.service';
import { PaginationService } from 'src/common/services/pagination.service';

@Module({
  providers: [UsersService, PrismaService, PaginationService],
  controllers: [UsersController],
})
export class UsersModule {}
