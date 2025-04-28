import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly userEm: EntityManager,
  ) {}

  async create(data: { username: string; password: string }): Promise<User> {
    const user = this.userRepository.create(data);
    await this.userEm.persistAndFlush(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ username });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    this.userRepository.assign(user, data);
    await this.userEm.flush();
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userEm.removeAndFlush(user);
  }
}
