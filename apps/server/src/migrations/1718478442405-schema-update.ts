import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1718478442405 implements MigrationInterface {
  name = 'SchemaUpdate1718478442405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "projects"."users" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "user_name" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "google_id" character varying NOT NULL, "avatar_url" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "projects"."users"`);
  }
}
