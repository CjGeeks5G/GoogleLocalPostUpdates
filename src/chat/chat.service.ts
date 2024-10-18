import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion-request.dto';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ExchangeService } from './exchange.service';
import { SearchProductService } from './search-product.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly openai: OpenAI,
    private readonly exchangeService: ExchangeService,
    private readonly searchService: SearchProductService,
  ) {}

  async createChatCompletion(messages: ChatCompletionMessageDto[]) {
    const exchangeRates = await this.exchangeService.getExchangeRates();

    // Leer el archivo CSV y obtener el contexto
    const context = await this.searchService.searchProducts(
      'src/assets/csv/products_list.csv',
    );

    // Validación: Imprimir el contexto generado

    // Generar contexto con los productos encontrados y las tasas de cambio
    const combinedContext = `
    Productos relacionados con":
    ${context}
    
    Tasas de cambio actuales (basadas en EUR):
    ${Object.entries(exchangeRates.rates)
      .map(([currency, rate]) => `${currency}: ${rate}`)
      .join('\n')}
    `;

    console.log('Contexto generado:\n', combinedContext);
    // Agregar el contexto a los mensajes
    const messagesWithContext = [
      { role: 'user', content: `Contexto: ${combinedContext}.` },
      ...messages,
    ];

    const response = await this.openai.chat.completions.create({
      messages: messagesWithContext as ChatCompletionMessageParam[],
      model: 'gpt-4o-mini',
    });

    return response;
  }
}
