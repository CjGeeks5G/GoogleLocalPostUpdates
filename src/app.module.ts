import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ExchangeService } from './chat/exchange.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}), ChatModule],
  controllers: [],
  providers: [ExchangeService],
})
export class AppModule {}
