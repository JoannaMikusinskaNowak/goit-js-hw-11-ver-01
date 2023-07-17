'use strict';

import Notiflix from 'notiflix';
import Axios from 'axios';

const search = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector(
  '.search-form button[type="submit"]'
);
const gallery = document.querySelector('.gallery');

//LocaL storage
let searchQuery = localStorage.getItem('searchQuery') || '';
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

const clearGallery = () => {
  gallery.innerHTML = '';
};

//options API
const showResult = image => {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  const infoItems = [
    createInfoItem('Likes', likes),
    createInfoItem('Views', views),
    createInfoItem('Comments', comments),
    createInfoItem('Downloads', downloads),
  ];

  const infoHTML = infoItems.map(infoItem => infoItem.outerHTML).join('');

  const photoCardHTML = `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" data-large-image="${largeImageURL}"  />
      <div class="info">
        ${infoHTML}
      </div>
    </div>`;
  gallery.innerHTML += photoCardHTML;
};

const modal = document.getElementById('modal');
modal.addEventListener('click', event => {
  if (event.target === modal) {
    closeModal();
  }
});

const openModal = imageURL => {
  const modal = document.getElementById('modal');
  const modalImage = document.querySelector('.modal-image');

  modalImage.src = imageURL;
  modal.style.display = 'block';
};

const closeModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
};

const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', closeModal);

const createInfoItem = (label, value) => {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}:</b> ${value}`;
  return infoItem;
};

/* API */
const requestParams = {
  key: '38204808-8b5a54ad42087b83e34935a48',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

const getRequestURL = params => {
  const baseURL = 'https://pixabay.com/api/';
  return Axios.get(baseURL, {
    params: {
      ...params,
      per_page: 40,
    },
  }).then(response => {
    const queryString = Object.entries(response.config.params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
    return `${baseURL}?${queryString}`;
  });
};

const getData = async (page = 1) => {
  requestParams.q = searchQuery;
  requestParams.page = page;
  const URL = await getRequestURL(requestParams);

  try {
    const response = await Axios.get(URL);
    const result = response.data;
    console.log(result);
    if (result.hits && result.hits.length > 0) {
      result.hits.forEach(image => {
        showResult(image);
      });
      showLoadMoreButton(result.totalHits, result.hits.length, page);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'An error occurred while fetching data. Please try again.'
    );
  }
};
//przycisk Load more
const showLoadMoreButton = (totalHits, currentCount, page) => {
  const loadMoreButton = document.querySelector('.load-more');
  if (currentCount >= totalHits) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMoreButton.style.display = 'block';
    currentPage = page;
    localStorage.setItem('currentPage', currentPage);
  }
};

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.addEventListener('click', () => {
  const page = currentPage + 1;
  getData(page);
});

//Event Listener

gallery.addEventListener('click', e => {
  if (e.target.tagName === 'IMG') {
    const largeImageURL = e.target.getAttribute('data-large-image');
    openModal(largeImageURL);
  }
});

searchButton.addEventListener('click', e => {
  e.preventDefault();
  searchQuery = search.value;
  localStorage.setItem('searchQuery', searchQuery);
  currentPage = 1;
  localStorage.setItem('currentPage', currentPage);
  getData(currentPage);
  search.value = '';
});
