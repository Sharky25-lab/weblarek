import { IBuyer, TPayment, TValidationErrors } from '../../types/index';
 
export class Buyer {
  protected payment: TPayment | null = null;
  protected email: string = '';
  protected phone: string = '';
  protected address: string = '';
 
  setPayment(value: TPayment): void {
    this.payment = value;
  }
 
  setAddress(value: string): void {
    this.address = value;
  }
 
  setEmail(value: string): void {
    this.email = value;
  }
 
  setPhone(value: string): void {
    this.phone = value;
  }
 
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }
 
  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }
 
  validate(): TValidationErrors {
    const errors: TValidationErrors = {};
 
    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите номер телефона';
    }
 
    return errors;
  }
}