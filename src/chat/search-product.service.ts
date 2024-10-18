import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class SearchProductService {
  // Method to search for products from the CSV file based on a query
  async searchProducts(filePath: string, query: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const results: string[] = [];
      const keywords = query.toLowerCase().split(' '); // Split query into individual keywords

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Concatenate relevant fields (like title, description, etc.) into a single searchable string
          const productText = `${data.displayTitle} ${data.productType} ${data.description} ${data.price}`.toLowerCase();

          // Check if the product matches all the keywords
          const isMatch = keywords.every(keyword => productText.includes(keyword));

          if (isMatch) {
            // Format the matching product description and add to results
            const productDescription = `Product: ${data.displayTitle} (Category: ${data.productType}), Price: ${data.price}, Discount: ${data.discount ? data.discount + '%' : 'No Discount'}`;
            results.push(productDescription);
          }
        })
        .on('end', () => {
          resolve(results); // Resolve the promise with the search results
        })
        .on('error', (error) => {
          console.error('Error reading the CSV file:', error);
          reject(new Error('Error reading the CSV file.'));
        });
    });
  }
}
