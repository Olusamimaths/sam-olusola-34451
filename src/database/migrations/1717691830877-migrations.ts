import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717691830877 implements MigrationInterface {
    name = 'Migrations1717691830877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`continuation_reserve\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`continuation\` text NULL, \`continuationKey\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_904e32c71f349bfb97735e073a\` (\`continuationKey\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_904e32c71f349bfb97735e073a\` ON \`continuation_reserve\``);
        await queryRunner.query(`DROP TABLE \`continuation_reserve\``);
    }

}
