import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1720213359058 implements MigrationInterface {
  name = 'SchemaUpdate1720213359058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" DROP CONSTRAINT "FK_d9f902e1b324ee3f35807599206"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" RENAME COLUMN "channelIdId" TO "channel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" ADD CONSTRAINT "FK_172af4652df61837a64d5e79955" FOREIGN KEY ("channel_id") REFERENCES "projects"."channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" DROP CONSTRAINT "FK_172af4652df61837a64d5e79955"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" RENAME COLUMN "channel_id" TO "channelIdId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects"."channel_users" ADD CONSTRAINT "FK_d9f902e1b324ee3f35807599206" FOREIGN KEY ("channelIdId") REFERENCES "projects"."channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
