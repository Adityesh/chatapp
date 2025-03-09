import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1720642501584 implements MigrationInterface {
  name = 'SchemaUpdate1720642501584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "projects"."message_attachments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "mime_type" character varying NOT NULL, "url" character varying NOT NULL, "size" integer NOT NULL, "messageId" integer, CONSTRAINT "PK_e5085d973567c61e9306f10f95b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_attachments" ADD CONSTRAINT "FK_5b4f24737fcb6b35ffdd4d16e13" FOREIGN KEY ("messageId") REFERENCES "projects"."messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."message_attachments" DROP CONSTRAINT "FK_5b4f24737fcb6b35ffdd4d16e13"`,
    );
    await queryRunner.query(`DROP TABLE "projects"."message_attachments"`);
  }
}
