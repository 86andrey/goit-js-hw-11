import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const submitForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '27913920-68ceae66209fe678afbf6b110';
const BASE_URL = 'https://pixabay.com/api/?key=';
const OPTIONS =
  '}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

let searchQuery = '';
let page = 1;
loadMoreBtn.style.display = 'none';
let total = 0;

submitForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  galleryList.innerHTML = '';
  searchQuery = e.currentTarget.elements.searchQuery.value;
  total = 0;
  if (searchQuery !== '') {
    page = 1;
    onLoadMore();
    page += 1;
  }
}

function onLoadMore() {
  loadMoreBtn.style.display = 'none';
  getPictures(searchQuery)
    .then(data => {
      renderPictures(data.hits);
      loadMoreBtn.style.display = 'block';
      if (page === 2) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
      page += 1;
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

async function getPictures(searchQuery) {
  const response = await axios.get(
    BASE_URL + API_KEY + `&q=${searchQuery}` + OPTIONS + `&page=${page}`
  );
  const totalHits = response.data.totalHits;
  if (total >= totalHits) {
    Notify.warning(
      'We`re sorry, but you`ve reached the end of search results.'
    );
    return (loadMoreBtn.style.display = 'none');
  }
  total += response.data.hits.length;

  return response.data;
}

function renderPictures(pictures) {
  const markup = pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" max-width="400px" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br>${likes}</br>
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}</br>
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}</br>
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}</br>
    </p>
  </div>
</div>
      `;
      }
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
}
