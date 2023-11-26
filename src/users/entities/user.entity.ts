import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon.hash(this.password);
  }

  async comparePassword(password: string): Promise<boolean> {
    const result = await argon.verify(this.password, password);
    return result;
  }

  async createToken(): Promise<string> {
    const { id, username } = this;
    return jwt.sign(
      { id, username, iat: Math.floor(Date.now() / 1000) * 60 * 60 },
      'secret',
    );
  }
}
