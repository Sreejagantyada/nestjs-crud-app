import { ConflictException, Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UsersService {

  private file = "src/data/users.json";

  private readUsers() {
    return JSON.parse(fs.readFileSync(this.file, "utf8"));
  }

  private saveUsers(users) {
    fs.writeFileSync(this.file, JSON.stringify(users, null, 2));
  }

  async createUser(email: string, password: string) {

    const existingUser = this.findByEmail(email);
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const users = this.readUsers();

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      email,
      password: hashed,
      firstName: "",
      lastName: "",
      phone: ""
    };

    users.push(user);

    this.saveUsers(users);

    return { id: user.id, email: user.email };
  }

  findByEmail(email: string) {

    const users = this.readUsers();

    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findById(id: string) {

    const users = this.readUsers();

    const user = users.find(u => u.id === id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    };
  }

  updateProfile(id: string, data) {

    const users = this.readUsers();

    const user = users.find(u => u.id === id);
    
    if(!user) return null;
    

    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.phone !== undefined) user.phone = data.phone;

    this.saveUsers(users);

    return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone
  };
    
  }

}