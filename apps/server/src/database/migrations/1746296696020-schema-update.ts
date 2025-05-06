import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1746296696020 implements MigrationInterface {
  name = 'SchemaUpdate1746296696020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects"."users"
        ADD "last_seen" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects"."users"
        DROP COLUMN "last_seen"`);
  }
}
