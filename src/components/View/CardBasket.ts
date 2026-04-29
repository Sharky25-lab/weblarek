import { Card, ICard } from './CardBase';
import { ensureElement } from '../../utils/utils';

export interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    this._deleteButton.addEventListener('click', onDelete);
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}