import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1747513081857 implements MigrationInterface {
    name = 'SchemaUpdate1747513081857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects"."message_attachments" ADD "vendor_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects"."message_attachments" DROP COLUMN "vendor_id"`);
    }

}
