import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Models/WebLarekApi';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { OrderForm, ContactsForm } from './components/View/Form';
import { Success } from './components/View/Success';

import { IProduct, TPayment } from './types';

const events = new EventEmitter();

const catalogModel = new ProductCatalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);
const webLarekApi = new WebLarekApi(new Api(API_URL));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate  = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate      = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate       = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate    = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate     = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(
  document.querySelector('.page__wrapper') as HTMLElement,
  events
);

const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);

const basketView = new Basket(
  cloneTemplate<HTMLElement>(basketTemplate),
  events
);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>(orderTemplate),
  events
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>(contactsTemplate),
  events
);

const successView = new Success(
  cloneTemplate<HTMLElement>(successTemplate),
  events
);

events.on<{ items: IProduct[] }>('catalog:changed', ({ items }) => {
  const cards = items.map((product) => {
    const card = new CardCatalog(
      cloneTemplate<HTMLElement>(cardCatalogTemplate),
      events
    );
    return card.render({
      id: product.id,
      title: product.title,
      image: `${CDN_URL}${product.image}`,
      category: product.category,
      price: product.price,
    });
  });

  page.render({ catalogItems: cards, basketCount: cartModel.getCount() });
});

events.on('basket:changed', () => {
  page.render({ basketCount: cartModel.getCount() });
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = catalogModel.getItem(id);
  if (product) {
    catalogModel.setSelectedItem(product);
  }
});

events.on<{ item: IProduct }>('preview:changed', ({ item }) => {
  const card = new CardPreview(
    cloneTemplate<HTMLElement>(cardPreviewTemplate),
    events
  );
  modal.render({
    content: card.render({
      id: item.id,
      title: item.title,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      description: item.description,
      price: item.price,
      inBasket: cartModel.hasItem(item.id),
    }),
  });
});

events.on<{ id: string }>('card:toBasket', ({ id }) => {
  const product = catalogModel.getItem(id);
  if (!product) return;

  if (cartModel.hasItem(id)) {
    cartModel.removeItem(product);
  } else {
    cartModel.addItem(product);
  }
  modal.close();
});

events.on('basket:open', () => {
  const basketCards = cartModel.getItems().map((product, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLElement>(cardBasketTemplate),
      events
    );
    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  modal.render({
    content: basketView.render({
      items: basketCards,
      total: cartModel.getTotalPrice(),
    }),
  });
});

events.on<{ id: string }>('basket:removeItem', ({ id }) => {
  const product = catalogModel.getItem(id);
  if (product) {
    cartModel.removeItem(product);
  }

  const basketCards = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLElement>(cardBasketTemplate),
      events
    );
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: basketCards,
    total: cartModel.getTotalPrice(),
  });
});

events.on('basket:order', () => {
  buyerModel.clear();
  modal.render({
    content: orderForm.render({
      payment: null,
      address: '',
      valid: false,
      errors: '',
    }),
  });
});

events.on<{ field: string; value: string }>('order:input', ({ field, value }) => {
  if (field === 'payment') {
    buyerModel.setPayment(value as TPayment);
  } else if (field === 'address') {
    buyerModel.setAddress(value);
  }

  const errors = buyerModel.validate();
  const orderErrors = [errors.payment, errors.address].filter(Boolean).join(' ');

  orderForm.render({
    payment: buyerModel.getData().payment,
    address: buyerModel.getData().address,
    valid: !errors.payment && !errors.address,
    errors: orderErrors,
  });
});

events.on('order:submit', () => {
  modal.render({
    content: contactsForm.render({
      email: '',
      phone: '',
      valid: false,
      errors: '',
    }),
  });
});

events.on<{ field: string; value: string }>('contacts:input', ({ field, value }) => {
  if (field === 'email') {
    buyerModel.setEmail(value);
  } else if (field === 'phone') {
    buyerModel.setPhone(value);
  }

  const errors = buyerModel.validate();
  const contactErrors = [errors.email, errors.phone].filter(Boolean).join(' ');

  contactsForm.render({
    email: buyerModel.getData().email,
    phone: buyerModel.getData().phone,
    valid: !errors.email && !errors.phone,
    errors: contactErrors,
  });
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getData();

  webLarekApi
    .createOrder({
      payment: buyer.payment!,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      items: cartModel.getItems().map((p) => p.id),
      total: cartModel.getTotalPrice(),
    })
    .then((response) => {
      cartModel.clear();
      buyerModel.clear();

      modal.render({
        content: successView.render({ total: response.total }),
      });
    })
    .catch((error) => {
      console.error('Ошибка оформления заказа:', error);
    });
});

events.on('success:close', () => {
  modal.close();
});

webLarekApi
  .getProducts()
  .then((response) => {
    catalogModel.setItems(response.items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки каталога:', error);
  });


