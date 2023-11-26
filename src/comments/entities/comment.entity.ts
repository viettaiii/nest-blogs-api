import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.children) // Quan hệ với chính entity hiện tại
  parent: number;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: true,
  })
  children: Comment[];
}
