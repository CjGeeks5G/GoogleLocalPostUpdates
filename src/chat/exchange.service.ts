import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExchangeService {
  private readonly exchangeRateApiUrl = process.env.EXCHANGE_RATE_API_URL;
  private readonly accessKey = process.env.EXCHANGE_RATE_API_KEY;

  // Método para obtener las tasas de cambio desde la API
  async getExchangeRates(): Promise<any> {
    try {
      const response = await axios.get(`${this.exchangeRateApiUrl}?access_key=${this.accessKey}`);
      return response.data;  // Retornamos los datos obtenidos de la API
    } catch (error) {
      console.error('Error al obtener las tasas de cambio:', error);
      throw new Error('No se pudo obtener las tasas de cambio.');
    }
  }
}
