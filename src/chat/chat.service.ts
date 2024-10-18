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

    const userMessage = messages.find((msg) => msg.role === 'user');

    if (!userMessage) {
      throw new Error('No se encontró un mensaje del usuario.');
    }

    const userQuestion = userMessage.content;

    // Read the CSV file and get the context
    const context = await this.searchService.searchProducts(
      'src/assets/csv/products_list.csv',
      userQuestion,
    );

    // Validation: Print the generated context

    // Generate context with the found products and exchange rates
    const combinedContext = `
    Related products to:
    ${context}
    
    Current exchange rates (based on EUR):
    ${Object.entries(exchangeRates.rates)
      .map(([currency, rate]) => `${currency}: ${rate}`)
      .join('\n')}
    `;

    console.log('Generated context:\n', combinedContext);

    // Add the context to the messages
    const messagesWithContext = [
      { role: 'user', content: `Context: ${combinedContext}.` },
      ...messages,
    ];

    const response = await this.openai.chat.completions.create({
      messages: messagesWithContext as ChatCompletionMessageParam[],
      model: 'gpt-4o-mini',
    });
    // Eliminar los saltos de línea innecesarios
    const cleanedResponse = response.choices[0].message.content.replace(
      /\n+/g,
      ' ',
    );

    // Retornar la respuesta limpia
    return cleanedResponse;
  }
}
