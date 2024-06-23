import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1719135697984 implements MigrationInterface {
  name = 'SchemaUpdate1719135697984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "accepted_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0adc0a8834ea0f252e96d154de" ON "projects"."users" ("full_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_074a1f262efaca6aba16f7ed92" ON "projects"."users" ("user_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "projects"."users" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "projects"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "projects"."IDX_074a1f262efaca6aba16f7ed92"`,
    );
    await queryRunner.query(
      `DROP INDEX "projects"."IDX_0adc0a8834ea0f252e96d154de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "accepted_at"`,
    );
  }
}
