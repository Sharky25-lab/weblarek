export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

export interface ApiOrderResponse {
  id: string;
  total: number;
}

export interface ApiProductsResponse {
  total: number;
  items: IProduct[];
}

export type TPayment = 'online' | 'cash';

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;
