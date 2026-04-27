import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected list: HTMLElement;
  protected _total: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  set items(value: HTMLElement[]) {
    this.list.replaceChildren(...value);
    this.orderButton.disabled = value.length === 0;
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}