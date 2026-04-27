import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    container.addEventListener('click', (event) => {
      if (event.target === container) {
        this.close();
      }
    });
}

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this._content.replaceChildren();
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}