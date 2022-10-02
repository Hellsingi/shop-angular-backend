import { MigrationInterface, QueryRunner } from 'typeorm';
import { productList } from '../utils/product-list';

export class test51631110263004 implements MigrationInterface {
  name = 'test51631110263004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL, "filmId" uuid NOT NULL, CONSTRAINT "REL_602b8150a4707dab6afaacf838" UNIQUE ("filmId"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "film" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_602b8150a4707dab6afaacf8387" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    for (const element of productList) {
      queryRunner
        .query(
          `INSERT INTO film (title, description, price) VALUES ('${element.title}', '${element.description}', ${element.price}) RETURNING id`
        )
        .then(async (column) => {
          await queryRunner.query(
            `INSERT INTO stock (count, "filmId") VALUES ('${Math.floor(
              Math.random() * 200
            )}', '${column[0].id}')`
          );
        });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_c39ebeb1006c7bd836605f7f04c"`
    );
    await queryRunner.query(`DROP TABLE "film"`);
    await queryRunner.query(`DROP TABLE "stock"`);
  }
}
