import { User } from '.prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateUserDto } from '../dto/CreateUserDto';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return user;
  }

  /**
   *
   * @param userData
   * @returns
   */
  async createUser(userData: { email: string }): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return this.prisma.user.create({
      data: userData,
    });
  }

  async createOne(userData: CreateUserDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }

        // Crear el usuario si no existe
        return prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
          },
        });
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Manejar otros tipos de errores aquí
      throw new Error('Failed to create user');
    }
  }

  async getPaginatedUsers(page: number = 1, limit: number = 10, query: string) {
    const searchFields = ['name', 'email']; // campos en los que quieres buscar
    return this.paginationService.paginate(
      'user',
      page,
      limit,
      query,
      searchFields,
    );
  }
}
