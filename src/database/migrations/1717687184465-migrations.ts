import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717687184465 implements MigrationInterface {
    name = 'Migrations1717687184465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`listing_to\` \`listing_to\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`listing_to\` \`listing_to\` bigint NOT NULL`);
    }

}
