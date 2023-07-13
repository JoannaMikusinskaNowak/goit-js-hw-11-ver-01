'use strict';

const search = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector(
  '.search-form button[type="submit"]'
);

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
  const gallery = document.querySelector('.gallery');

  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const img = document.createElement('img');
  img.setAttribute('src', webformatURL);
  img.alt = tags;
  img.loading = 'lazy';

  img.addEventListener('click', () => {
    openModal(largeImageURL);
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

  const info = document.createElement('div');
  info.classList.add('info');

  const likesInfo = createInfoItem('Likes', likes);
  const viewsInfo = createInfoItem('Views', views);
  const commentsInfo = createInfoItem('Comments', comments);
  const downloadsInfo = createInfoItem('Downloads', downloads);

  info.append(likesInfo, viewsInfo, commentsInfo, downloadsInfo);
  photoCard.append(img, info);
  gallery.appendChild(photoCard);
};

const modal = document.getElementById('modal');
modal.addEventListener('click', event => {
  if (event.target === modal) {
    closeModal();
  }
});

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

const getRequestURL = (params, page) => {
  const baseURL = 'https://pixabay.com/api/';
  const queryParams = {
    ...params,
    page,
    per_page: 40,
  };
  const queryString = Object.entries(queryParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
  return `${baseURL}?${queryString}`;
};

const getData = async (searchValue, page = 1) => {
  requestParams.q = searchValue;
  const URL = getRequestURL(requestParams, page);

  try {
    const response = await axios.get(URL);
    const result = response.data;

    if (result.hits.length > 0) {
      result.hits.forEach(showResult);
      showLoadMoreButton(result.totalHits, result.hits.length, page);
    } else {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
    notiflix.Notify.failure(
      'An error occurred while fetching data. Please try again.'
    );
  }
};
//przycisk Load more
const showLoadMoreButton = (totalHits, currentCount, page) => {
  const loadMoreButton = document.querySelector('.load-more');
  if (currentCount >= totalHits) {
    loadMoreButton.style.display = 'none';
    notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMoreButton.style.display = 'block';
    loadMoreButton.dataset.page = page;
  }
};

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.addEventListener('click', () => {
  const page = parseInt(loadMoreButton.dataset.page) + 1;
  const searchValue = search.value;
  getData(searchValue, page);
});

//Event Listener
searchButton.addEventListener('click', e => {
  e.preventDefault();
  const gallery = document.querySelector('.gallery');
  const searchValue = search.value;
  getData(searchValue);
  search.value = '';
});

//AXIOS
// Make a request for a user with a given ID
axios
  .get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Optionally the request above could also be done as
axios
  .get('/user', {
    params: {
      ID: 12345,
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
