import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IPage {
  catalogItems: HTMLElement[];
  basketCount: number;
}

export class Page extends Component<IPage> {
  protected gallery: HTMLElement;
  protected basketCounter: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.gallery = ensureElement<HTMLElement>('.gallery', container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set catalogItems(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }

  set basketCount(count: number) {
    this.basketCounter.textContent = String(count);
  }
}