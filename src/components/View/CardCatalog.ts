import { Card, ICard } from './CardBase';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardCatalog extends ICard {
  image: string;
  category: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    container.addEventListener('click', onClick);
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