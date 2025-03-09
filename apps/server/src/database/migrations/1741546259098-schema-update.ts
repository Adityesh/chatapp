import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1741546259098 implements MigrationInterface {
  name = 'SchemaUpdate1741546259098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "FK_07ef035181c8897a846fde4a735"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "FK_9b7bb27b4207ce4ab4ae7718312"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" RENAME COLUMN "is_group" TO "channel_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" DROP COLUMN "status"`,
    );
    await queryRunner.query(`DROP TYPE "projects"."messages_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "requested_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "addressed_to"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "projects"."message_status_status_enum" AS ENUM('sent', 'delivered', 'read', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD "status" "projects"."message_status_status_enum" NOT NULL DEFAULT 'sent'`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD "error" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_attachments" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" ADD "is_edited" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" ADD "reply_to" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "requester_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "recipient_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" DROP COLUMN "channel_type"`,
    );
    await queryRunner.query(
      `CREATE TYPE "projects"."channels_channel_type_enum" AS ENUM('DIRECT', 'GROUP')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" ADD "channel_type" "projects"."channels_channel_type_enum" NOT NULL DEFAULT 'DIRECT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "UQ_cafdaa42198b791b8bc7e2b516d" UNIQUE ("requester_id", "recipient_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" ADD CONSTRAINT "FK_5c253c352f5150e6ccf1e1ec374" FOREIGN KEY ("reply_to") REFERENCES "projects"."messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "FK_ebe9e7a9bbda233035e2f7a9008" FOREIGN KEY ("requester_id") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "FK_cc3e536ca9f324cdccc60990889" FOREIGN KEY ("recipient_id") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "FK_cc3e536ca9f324cdccc60990889"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "FK_ebe9e7a9bbda233035e2f7a9008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" DROP CONSTRAINT "FK_5c253c352f5150e6ccf1e1ec374"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP CONSTRAINT "UQ_cafdaa42198b791b8bc7e2b516d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" DROP COLUMN "channel_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "projects"."channels_channel_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" ADD "channel_type" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "recipient_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "requester_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" DROP COLUMN "reply_to"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" DROP COLUMN "is_edited"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_attachments" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP COLUMN "error"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "projects"."message_status_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "addressed_to" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "requested_by" integer`,
    );
    await queryRunner.query(
      `CREATE TYPE "projects"."messages_status_enum" AS ENUM('sent', 'delivered', 'read')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" ADD "status" "projects"."messages_status_enum" NOT NULL DEFAULT 'sent'`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" RENAME COLUMN "channel_type" TO "is_group"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "FK_9b7bb27b4207ce4ab4ae7718312" FOREIGN KEY ("addressed_to") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD CONSTRAINT "FK_07ef035181c8897a846fde4a735" FOREIGN KEY ("requested_by") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
