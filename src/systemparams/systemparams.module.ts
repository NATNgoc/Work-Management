import { Module } from '@nestjs/common';
import { SystemparamsService } from './systemparams.service';
import { SystemParameter } from './entities/systemparam.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SystemParameter])],
  providers: [SystemparamsService],
  exports: [SystemparamsService],
})
export class SystemparamsModule {}
