import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./Book.entity.js";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ name: "category_id", type: "bigint" })
  categoryId: number;

  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
