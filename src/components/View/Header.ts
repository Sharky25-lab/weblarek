import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IHeader {
  basketCount: number;
}

export class Header extends Component<IHeader> {
  protected _counter: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this._button = ensureElement<HTMLButtonElement>('.header__basket', container);

    this._button.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }

  set basketCount(count: number) {
    this._counter.textContent = String(count);
  }
}