import {
  AfterInsert,
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockEntity } from './stock.entity';

@Entity('film')
export class FilmEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToOne(() => StockEntity, (stock) => stock.film, { cascade: true })
  stock: StockEntity;
  count: number;

  @AfterLoad()
  @AfterInsert()
  protected setCount(): void {
    if (this.stock) {
      this.count = this.stock.count;
      delete this.stock;
    }
  }
}
