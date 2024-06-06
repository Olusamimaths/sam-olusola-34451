import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717682296663 implements MigrationInterface {
    name = 'Migrations1717682296663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`activity\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`contract_address\` varchar(42) NOT NULL, \`token_index\` text NOT NULL, \`listing_price\` decimal(36,18) NOT NULL, \`marker\` varchar(42) NOT NULL, \`listing_from\` bigint NOT NULL, \`listing_to\` bigint NOT NULL, \`event_timestamp\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`activity\``);
    }

}
