import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Models/WebLarekApi';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
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
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate  = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(
  ensureElement<HTMLElement>('.header'),
  events
);

const gallery = new Gallery(
  ensureElement<HTMLElement>('.gallery')
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
      () => catalogModel.setSelectedItem(product)
    );
    return card.render({
      title: product.title,
      image: `${CDN_URL}${product.image}`,
      category: product.category,
      price: product.price,
    });
  });

  gallery.render({ items: cards });
});

events.on('basket:changed', () => {
  const basketCards = cartModel.getItems().map((product, index) => {
    const card = new CardBasket(
      cloneTemplate<HTMLElement>(cardBasketTemplate),
      () => cartModel.removeItem(product)
    );
    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: basketCards,
    total: cartModel.getTotalPrice(),
  });

  header.render({ basketCount: cartModel.getCount() });
});

events.on<{ item: IProduct }>('preview:changed', ({ item }) => {
  const card = new CardPreview(
    cloneTemplate<HTMLElement>(cardPreviewTemplate),
    () => events.emit('card:toBasket')
  );

  modal.render({
    content: card.render({
      title: item.title,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      description: item.description,
      inBasket: cartModel.hasItem(item.id),
      price: item.price,
    }),
  });
});

const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

events.on('modal:open', () => {
    pageWrapper.classList.add('page__wrapper_locked');
});
events.on('modal:close', () => {
    pageWrapper.classList.remove('page__wrapper_locked');
});

events.on('buyer:changed', () => {
  const data   = buyerModel.getData();
  const errors = buyerModel.validate();

  const orderErrors = [errors.payment, errors.address].filter(Boolean).join(' ');
  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: orderErrors.length === 0,
    errors: orderErrors,
  });

  const contactErrors = [errors.email, errors.phone].filter(Boolean).join(' ');
  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: contactErrors.length === 0,
    errors: contactErrors,
  });
});

events.on('card:toBasket', () => {
  const item = catalogModel.getSelectedItem();
  if (!item) return;

  if (cartModel.hasItem(item.id)) {
    cartModel.removeItem(item);
  } else {
    cartModel.addItem(item);
  }
  modal.close();
});

events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
});

events.on('basket:order', () => {
  buyerModel.clear();
  modal.render({ content: orderForm.render() });
});

events.on<{ field: string; value: string }>('order:input', ({ field, value }) => {
  if (field === 'payment') {
    buyerModel.setPayment(value as TPayment);
  } else if (field === 'address') {
    buyerModel.setAddress(value);
  }
});

events.on('order:submit', () => {
  modal.render({ content: contactsForm.render() });
});

events.on<{ field: string; value: string }>('contacts:input', ({ field, value }) => {
  if (field === 'email') {
    buyerModel.setEmail(value);
  } else if (field === 'phone') {
    buyerModel.setPhone(value);
  }
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
      modal.render({ content: successView.render({ total: response.total }) });
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


