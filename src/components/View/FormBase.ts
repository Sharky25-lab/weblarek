import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
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
      this.events.emit(`${container.name}:input`, {
        field: target.name,
        value: target.value,
      });
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