import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1719135445032 implements MigrationInterface {
  name = 'SchemaUpdate1719135445032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "projects"."connections_status_enum" AS ENUM('pending', 'accepted', 'declined', 'blocked')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects"."connections" ("id" SERIAL NOT NULL, "status" "projects"."connections_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "requested_by" integer, "addressed_to" integer, CONSTRAINT "PK_0a1f844af3122354cbd487a8d03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "FK_07ef035181c8897a846fde4a735" FOREIGN KEY ("requested_by") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "FK_9b7bb27b4207ce4ab4ae7718312" FOREIGN KEY ("addressed_to") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "FK_9b7bb27b4207ce4ab4ae7718312"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "FK_07ef035181c8897a846fde4a735"`,
    );
    await queryRunner.query(`DROP TABLE "projects"."connections"`);
    await queryRunner.query(`DROP TYPE "projects"."connections_status_enum"`);
  }
}
