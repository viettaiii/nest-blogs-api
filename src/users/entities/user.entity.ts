import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Comment } from 'src/comments/entities/comment.entity';
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

  @OneToMany(() => Blog, (blog) => blog.user, { cascade: true })
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

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
