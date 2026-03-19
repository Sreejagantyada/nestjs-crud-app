import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string) {

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({
      email,
      password: hashed,
    });

    const saved = await this.usersRepo.save(user);

    return { id: saved.id, email: saved.email };
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({
      where: { email }
    });
  }

  async findById(id: string) {

    const user = await this.usersRepo.findOne({
      where: { id }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    };
  }

  async updateProfile(id: string, data) {

    const user = await this.usersRepo.findOne({
      where: { id }
    });

    if (!user) return null;

    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.phone !== undefined) user.phone = data.phone;

    const updated = await this.usersRepo.save(user);

    return {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone
    };
  }
}