import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class SearchProductService {
  // Método para leer productos desde el archivo CSV
  async searchProducts(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const results: string[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Validar que los campos no sean undefined o null y generar el contexto de productos
          if (data.displayTitle && data.price && data.productType) {
            results.push(`Product: ${data.displayTitle} (Category: ${data.productType}), Price: ${data.price}, Discount: ${data.discount ? data.discount + '%' : 'No Discount'}`);
          }
        })
        .on('end', () => {
          const context = results.join('\n');  // Separar los productos con saltos de línea
          resolve(context);
        })
        .on('error', (error) => {
          console.error('Error al leer el archivo CSV:', error);
          reject(new Error('Error al leer el archivo CSV.'));
        });
    });
  }
}

