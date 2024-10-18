import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import OpenAI from 'openai';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExchangeService } from './exchange.service';
import { SearchProductService } from './search-product.service';

@Module({
  controllers: [ChatController],
  imports: [ConfigModule],
  providers: [
    ChatService,
    ExchangeService,
    SearchProductService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) =>
        new OpenAI({ apiKey: configService.getOrThrow('OPENAI_API_KEY') }),
      inject: [ConfigService],
    },
  ],
})
export class ChatModule {}
