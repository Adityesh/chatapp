import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1718739215366 implements MigrationInterface {
  name = 'SchemaUpdate1718739215366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."users" ALTER COLUMN "google_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."users" ALTER COLUMN "google_id" SET NOT NULL`,
    );
  }
}
