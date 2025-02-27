import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleService {
  async getPhoneNumber(accessToken: string): Promise<string | null> {
    try {
      const response = await axios.get(
        'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
      return response.data?.phoneNumbers?.[0]?.value || null;
    } catch (error) {
      console.error(
        'Error fetching phone number:',
        error.response?.data || error.message,
      );
      return null;
    }
  }
}
