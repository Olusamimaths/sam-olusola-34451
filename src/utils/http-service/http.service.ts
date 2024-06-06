import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { IHttpResponse, IHttpService } from './types';
import { BaseService } from '@/common';

@Injectable()
export class HttpService extends BaseService implements IHttpService {
  constructor() {
    super(HttpService.name);
    axios.interceptors.response.use((response) => {
      return response.data;
    });
  }

  public async post<T = any>(
    url: string,
    body: Record<string, string | any>,
    headers?: Record<string, string>,
  ): Promise<IHttpResponse<T>> {
    try {
      return await axios.post<T>(url, body, {
        headers,
      });
    } catch (error) {
      this.logger.error(error?.response?.data);
    }
  }

  public async put(
    url: string,
    body: Record<string, string | any> | Buffer,
    headers?: Record<string, string>,
  ): Promise<IHttpResponse> {
    try {
      return await axios.put(url, body, {
        headers,
      });
    } catch (error) {
      this.logger.error(error?.response?.data);
    }
  }

  public async patch(
    url: string,
    body: Record<string, string | any> | Buffer,
    headers?: Record<string, string>,
  ): Promise<IHttpResponse> {
    try {
      return await axios.patch(url, body, {
        headers,
      });
    } catch (error) {
      this.logger.error(error?.response?.data);
    }
  }

  public async get(
    url: string,
    headers?: Record<string, string>,
  ): Promise<IHttpResponse> {
    try {
      return await axios.get(url, {
        headers,
      });
    } catch (error) {
      this.logger.error(error?.response?.data);
      throw new BadRequestException(
        error?.response?.data?.error || 'Bad Request',
      );
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
      throw new BadRequestException();
    }
  }
}
