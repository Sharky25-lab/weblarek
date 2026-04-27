import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface IForm {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('[type=submit]', container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

    container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${container.name}:input`, { field, value });
    });

    container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsContainer.textContent = value;
  }
}

export interface IOrderForm extends IForm {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
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

export interface IContactsForm extends IForm {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('[name=email]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('[name=phone]', container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}