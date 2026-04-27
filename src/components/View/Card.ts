import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICard {
  id: string;
  title: string;
  price: number | null;
}

export interface ICardCatalog extends ICard {
  image: string;
  category: string;
}

export interface ICardPreview extends ICardCatalog {
  description: string;
  inBasket: boolean;
}

export interface ICardBasket extends ICard {
  index: number;
}

export abstract class Card<T extends ICard> extends Component<T> {
  protected _id: string = '';
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
  }
}

export class CardCatalog extends Card<ICardCatalog> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);

    container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.id });
    });
  }

  set image(value: string) {
    this._image.src = value;
    this._image.alt = this._title.textContent ?? '';
  }

  set category(value: string) {
    this._category.textContent = value;

    Object.values(categoryMap).forEach((cls) => {
      this._category.classList.remove(cls);
    });

    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this._category.classList.add(modifier);
    }
  }
}

export class CardPreview extends Card<ICardPreview> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._description = ensureElement<HTMLElement>('.card__text', container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', container);

    this.button.addEventListener('click', () => {
      this.events.emit('card:toBasket', { id: this.id });
    });
  }

  set image(value: string) {
    this._image.src = value;
    this._image.alt = this._title.textContent ?? '';
  }

  set category(value: string) {
    this._category.textContent = value;
    Object.values(categoryMap).forEach((cls) => {
      this._category.classList.remove(cls);
    });
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this._category.classList.add(modifier);
    }
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set inBasket(value: boolean) {
    this.button.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }

  set price(value: number | null) {
    if (value !== null) {
      this._price.textContent = `${value} синапсов`;
      this.button.disabled = false;
      this.button.textContent = 'В корзину';
    } else {
      this._price.textContent = 'Бесценно';
      this.button.disabled = true;
      this.button.textContent = 'Недоступно';
    }
  }
}

export class CardBasket extends Card<ICardBasket> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this._deleteButton.addEventListener('click', () => {
      this.events.emit('basket:removeItem', { id: this.id });
    });
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}