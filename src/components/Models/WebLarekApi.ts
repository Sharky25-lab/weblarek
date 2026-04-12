import { IApi, TOrderRequest, ApiOrderResponse, ApiProductsResponse } from '../../types/index';
 
export class WebLarekApi {
  private api: IApi;
 
  constructor(api: IApi) {
    this.api = api;
  }
 
  getProducts(): Promise<ApiProductsResponse> {
    return this.api.get<ApiProductsResponse>('/product/');
  }
 
  createOrder(order: TOrderRequest): Promise<ApiOrderResponse> {
    return this.api.post<ApiOrderResponse>('/order', order);
  }
}