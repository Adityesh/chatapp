import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1719153773700 implements MigrationInterface {
  name = 'SchemaUpdate1719153773700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "projects"."channel_users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, "channelIdId" integer, CONSTRAINT "PK_2237cedc2591a4ad08535ec0f9c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects"."channels" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "topic" character varying, "description" character varying, "is_deleted" boolean NOT NULL DEFAULT false, "created_by" integer, CONSTRAINT "UQ_069b6c9c74fb42c2e31a8987592" UNIQUE ("topic"), CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_069b6c9c74fb42c2e31a898759" ON "projects"."channels" ("topic") `,
    );
    await queryRunner.query(
      `CREATE TYPE "projects"."messages_status_enum" AS ENUM('sent', 'delivered', 'read')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects"."messages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "status" "projects"."messages_status_enum" NOT NULL DEFAULT 'sent', "sender_id" integer, "channel_id" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects"."message_status" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "delivered_at" TIMESTAMP NOT NULL DEFAULT now(), "read_at" TIMESTAMP DEFAULT now(), "message_id" integer, "user_id" integer, CONSTRAINT "PK_fd8b82470959145fdf427784046" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "accepted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."users" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."users" ADD CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" ADD CONSTRAINT "FK_a7a2db7198d61d6a301fdfeb3ed" FOREIGN KEY ("user_id") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" ADD CONSTRAINT "FK_d9f902e1b324ee3f35807599206" FOREIGN KEY ("channelIdId") REFERENCES "projects"."channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" ADD CONSTRAINT "FK_2573c3526ed4a83cc830762012e" FOREIGN KEY ("created_by") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" ADD CONSTRAINT "FK_86b9109b155eb70c0a2ca3b4b6d" FOREIGN KEY ("channel_id") REFERENCES "projects"."channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD CONSTRAINT "FK_ff8dd09dba401134707f7fdafd1" FOREIGN KEY ("message_id") REFERENCES "projects"."messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" ADD CONSTRAINT "FK_4ae52d84e883c882b2f964d852f" FOREIGN KEY ("user_id") REFERENCES "projects"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP CONSTRAINT "FK_4ae52d84e883c882b2f964d852f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."message_status" DROP CONSTRAINT "FK_ff8dd09dba401134707f7fdafd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" DROP CONSTRAINT "FK_86b9109b155eb70c0a2ca3b4b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channels" DROP CONSTRAINT "FK_2573c3526ed4a83cc830762012e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" DROP CONSTRAINT "FK_d9f902e1b324ee3f35807599206"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" DROP CONSTRAINT "FK_a7a2db7198d61d6a301fdfeb3ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."users" DROP CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."connections" ADD "accepted_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP TABLE "projects"."message_status"`);
    await queryRunner.query(`DROP TABLE "projects"."messages"`);
    await queryRunner.query(`DROP TYPE "projects"."messages_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "projects"."IDX_069b6c9c74fb42c2e31a898759"`,
    );
    await queryRunner.query(`DROP TABLE "projects"."channels"`);
    await queryRunner.query(`DROP TABLE "projects"."channel_users"`);
  }
}
