import { Card, ICard } from './CardBase';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardPreview extends ICard {
  image: string;
  category: string;
  description: string;
  inBasket: boolean;
}

export class CardPreview extends Card<ICardPreview> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._description = ensureElement<HTMLElement>('.card__text', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);
    this._button.addEventListener('click', onClick);
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
    if (!this._button.disabled) {
      this._button.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }
  }

  set price(value: number | null) {
    if (value !== null) {
      this._price.textContent = `${value} синапсов`;
      this._button.disabled = false;
    } else {
      this._price.textContent = 'Бесценно';
      this._button.disabled = true;
      this._button.textContent = 'Недоступно';
    }
  }
}