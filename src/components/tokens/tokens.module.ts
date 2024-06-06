import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Tokens])],
  providers: [TokensService],
})
export class TokensModule {}
