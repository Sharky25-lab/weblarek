import './scss/styles.scss';
 
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Models/WebLarekApi';

console.log('API_URL:', API_URL);
 
const catalogModel = new ProductCatalog();

const cartModel = new Cart();

const buyerModel = new Buyer();

const webLarekApi = new WebLarekApi(new Api(API_URL));

// ProductCatalog
 
catalogModel.setItems(apiProducts.items);
console.log('Каталог:', catalogModel.getItems());
console.log('Товар по id:', catalogModel.getItem(apiProducts.items[0].id));
catalogModel.setSelectedItem(apiProducts.items[0]);
console.log('Выбранный товар:', catalogModel.getSelectedItem());

// Cart
 
const product = apiProducts.items[0];
cartModel.addItem(product);
cartModel.addItem(apiProducts.items[1]);
console.log('Корзина:', cartModel.getItems());
console.log('Кол-во / сумма:', cartModel.getCount(), cartModel.getTotalPrice());
console.log('Есть в корзине:', cartModel.hasItem(product.id));
cartModel.removeItem(product);
console.log('После удаления:', cartModel.getItems());
cartModel.clear();
console.log('После очистки:', cartModel.getItems());

// Buyer
 
console.log('Валидация (пусто):', buyerModel.validate());
buyerModel.setPayment('online');
buyerModel.setAddress('Москва, ул. Первая, д. 1');
buyerModel.setEmail('123@gmail.com');
buyerModel.setPhone('+79123456789');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация (заполнено):', buyerModel.validate());
buyerModel.clear();
console.log('После очистки:', buyerModel.getData());

// Запрос к серверу
 
webLarekApi.getProducts()
  .then((response) => {
    catalogModel.setItems(response.items);
    console.log('Каталог с сервера:', catalogModel.getItems());
  })
  .catch((error) => {
    console.error('Ошибка запроса к серверу:', error);
  });


