import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn()
  userId: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: new Date() })
  created_at: Date;
}
