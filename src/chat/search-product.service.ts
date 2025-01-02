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

      // Check if the file exists before proceeding
      if (!fs.existsSync(filePath)) {
        return reject(new Error('File not found.'));
      }

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Log the raw data to check if it is being parsed correctly
          console.log('Parsed data:', data);

          const businessName = data.businessName || '';
          const location = data.location || '';
          const zipCode = data.zipCode || '';
          const tags = data.tags || '';
          const message = data.message || '';
          const phone = data.phone || '';

          const productText = `${businessName} ${location} ${zipCode} ${tags} ${message} ${phone}`.toLowerCase();

          // Check if the data is correct
          const normalizedText = productText.replace(/[^\w\s]/g, '');
          const isMatch = keywords.every(keyword => normalizedText.includes(keyword));

          if (isMatch) {
            const productDescription = `Company: ${businessName}, Location: ${location}, Tags: ${tags}, Message: ${message}`;
            results.push(productDescription);
          }
        })
        .on('end', () => {
          console.log('Finished reading the CSV file.');
          resolve(results); // Resolve the promise with the search results
        })
        .on('error', (error) => {
          console.error('Error reading the CSV file:', error);
          reject(new Error('Error reading the CSV file.'));
        });

    });
  }
}
