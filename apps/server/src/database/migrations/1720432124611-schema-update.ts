import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1720432124611 implements MigrationInterface {
  name = 'SchemaUpdate1720432124611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP COLUMN "sent_at"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD "sent_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
