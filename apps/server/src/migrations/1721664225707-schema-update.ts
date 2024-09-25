import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1721664225707 implements MigrationInterface {
    name = 'SchemaUpdate1721664225707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects"."channel_users" ADD "is_admin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "projects"."channels" ADD "channel_avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects"."channels" DROP COLUMN "channel_avatar"`);
        await queryRunner.query(`ALTER TABLE "projects"."channel_users" DROP COLUMN "is_admin"`);
    }

}
