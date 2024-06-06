export interface IHttpResponse<T = any> {
  status: number;
  data: T | any;
  message?: string;
}
