import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1719154185363 implements MigrationInterface {
  name = 'SchemaUpdate1719154185363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" ADD "is_group" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" DROP COLUMN "is_group"`,
    );
  }
}
