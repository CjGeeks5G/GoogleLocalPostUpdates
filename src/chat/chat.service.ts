import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion-request.dto';
import { ChatCompletionMessageParam } from 'openai/resources';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ChatService {
  constructor(private readonly openai: OpenAI) {}

  // const filePath = 'src/assets/csv/products_list.csv';  // Ruta hacia el CSV
  // Método para leer el archivo CSV y crear contexto
  async readCSV(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Validar que los campos no sean undefined o null y generar el contexto
          if (data.displayTitle && data.price && data.productType) {
            results.push(`Product: ${data.displayTitle} (Category: ${data.productType}), Price: ${data.price}, Discount: ${data.discount ? data.discount + '%' : 'No Discount'}`);
          }
        })
        .on('end', () => {
          const context = results.join('\n');
          resolve(context);
        })
        .on('error', (error) => reject(error));
    });
  }
  

  async createChatCompletion(messages: ChatCompletionMessageDto[]) {
    // Leer el archivo CSV y obtener el contexto
    const context = await this.readCSV('src/assets/csv/products_list.csv');

    // Validación: Imprimir el contexto generado
    console.log('Contexto generado:\n', context);

    // Agregar el contexto a los mensajes (puedes personalizar cómo lo usas)
    const messagesWithContext = [
      { role: 'user', content: `Contexto: ${context}. Por favor, confirma que has recibido esta información antes de proceder.` },
      ...messages,
    ];
    const response = await this.openai.chat.completions.create({
      messages: messagesWithContext as ChatCompletionMessageParam[],
      model: 'gpt-4o-mini',
    });
    
  }
}
