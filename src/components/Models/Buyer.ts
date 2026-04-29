import { IBuyer, TPayment, TValidationErrors } from '../../types/index';
import { IEvents } from '../base/Events';
 
export class Buyer {
  protected payment: TPayment | null = null;
  protected email: string = '';
  protected phone: string = '';
  protected address: string = '';

  constructor(protected events: IEvents) {}
 
  setPayment(value: TPayment): void {
    this.payment = value;
    this.events.emit('buyer:changed', this.getData());
  }
 
  setAddress(value: string): void {
    this.address = value;
    this.events.emit('buyer:changed', this.getData());
  }
 
  setEmail(value: string): void {
    this.email = value;
    this.events.emit('buyer:changed', this.getData());
  }
 
  setPhone(value: string): void {
    this.phone = value;
    this.events.emit('buyer:changed', this.getData());
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
    this.events.emit('buyer:changed', this.getData());
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