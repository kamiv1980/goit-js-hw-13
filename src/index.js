import './styles.css';
import apiService from './apiService.js';
import imagesListTamplate from './tamplate/ImagesList.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import debounce from 'lodash.debounce';
import * as basicLightbox from 'basiclightbox';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('ul.gallery');
const buttonLoad = document.querySelector('button[data-action="load-more"]');
const input = document.querySelector('input.search__input');
let page = 1;
let alertMsg;

buttonLoad.addEventListener('click', AddPage);

searchForm.addEventListener('submit', event => {
  event.preventDefault();
});

searchForm.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 500),
);

function AddPage() {
  page += 1;
  const searchQuery = input.value;
  apiService(searchQuery, page).then(data => {
    alertMsg = data.total;
    const output = buildImagesList(data);
    if (!data) {
      alert('Больше ничего нет');
      return;
    } else {
      const heightPage = document.body.scrollHeight;
      insertListItems(output);
      window.scrollTo({ top: heightPage, behavior: 'smooth' });
    }
  });
}

function searchFormInputHandler(e) {
  const searchQuery = e.target.value;

  clearListItems();

  apiService(searchQuery, page).then(data => {
    alertMsg = data.total;
    const output = buildImagesList(data);
    if (!data) {
      alert('Ничего не найдено.Корректно введите запрос');
      return;
    } else {
      insertListItems(output);
    }
  });
}

function insertListItems(items) {
  gallery.insertAdjacentHTML('beforeend', items);
  PNotify.notice({
    title: 'Regular Notice',
    text: `Found matches ${alertMsg}`,
  });
}

function buildImagesList(items) {
  return imagesListTamplate(items);
}

function clearListItems() {
  page = 1;
  gallery.innerHTML = '';
}

function modalWindow(event) {
  if (event.target.matches('.gallery__image')) {
    event.preventDefault();
    const target = event.target;
    const instance = basicLightbox.create(`
    <img src=${target.getAttribute('data-source')} width="800" height="600">
`);
    instance.show();
  }
}

gallery.addEventListener('click', modalWindow);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0 && input.value) {
        setTimeout(() => {
          AddPage();
        }, 5000);
      }
    });
  },
  { root: document.querySelector('container__gallery'), threshold: 1 },
);
observer.observe(document.querySelector('#infinite-scroll-trigger'));
