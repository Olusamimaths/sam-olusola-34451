import { IHttpResponse } from './response.interface';

export interface IHttpService {
  get(url: string, headers?: Record<string, string>): Promise<IHttpResponse>;
}
