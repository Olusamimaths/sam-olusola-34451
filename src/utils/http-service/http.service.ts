import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { IHttpResponse, IHttpService } from './types';
import { BaseService } from '@/common';
import { HttpMessages } from './http.messages';

@Injectable()
export class HttpService extends BaseService implements IHttpService {
  constructor() {
    super(HttpService.name);
  }

  public async get<T = any>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<IHttpResponse<T>> {
    try {
      const response = await axios.get<T>(url, {
        headers,
      });

      return {
        status: response.status,
        data: response.data as T,
        message: response.statusText,
      };
    } catch (error) {
      this.logger.error(error?.response?.data);
      throw new BadRequestException(HttpMessages.FAILURE.ERROR_OCCURED);
    }
  }

  public async delete(
    url: string,
    headers?: Record<string, string>,
  ): Promise<IHttpResponse> {
    try {
      return await axios.delete(url, {
        headers,
      });
    } catch (error) {
      this.logger.error(error?.response?.data);
      throw new BadRequestException(HttpMessages.FAILURE.ERROR_OCCURED);
    }
  }
}
