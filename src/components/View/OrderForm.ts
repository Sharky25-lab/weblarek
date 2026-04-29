import { Form, IForm } from './FormBase';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface IOrderForm extends IForm {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.onlineButton = ensureElement<HTMLButtonElement>('[name=card]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('[name=cash]', container);
    this.addressInput = ensureElement<HTMLInputElement>('[name=address]', container);

    this.onlineButton.addEventListener('click', () => {
      this.events.emit('order:input', { field: 'payment', value: 'online' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:input', { field: 'payment', value: 'cash' });
    });
  }

  set payment(value: TPayment | null) {
    this.onlineButton.classList.toggle('button_alt-active', value === 'online');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}