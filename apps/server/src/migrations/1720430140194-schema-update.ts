import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1720430140194 implements MigrationInterface {
  name = 'SchemaUpdate1720430140194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD "sent_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ALTER COLUMN "delivered_at" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ALTER COLUMN "delivered_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP COLUMN "sent_at"`,
    );
  }
}
