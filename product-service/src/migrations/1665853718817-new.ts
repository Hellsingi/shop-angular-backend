import { MigrationInterface, QueryRunner } from "typeorm";

export class new1665853718817 implements MigrationInterface {
    name = 'new1665853718817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_602b8150a4707dab6afaacf8387"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_602b8150a4707dab6afaacf8387" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_602b8150a4707dab6afaacf8387"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_602b8150a4707dab6afaacf8387" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
