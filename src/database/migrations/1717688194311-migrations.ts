import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717688194311 implements MigrationInterface {
    name = 'Migrations1717688194311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`contract_address\` varchar(42) NOT NULL, \`index\` text NOT NULL, \`listing_price\` decimal(36,18) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}
