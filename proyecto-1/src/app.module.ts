import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule],
  providers: [PrismaService],
})
export class AppModule {}
