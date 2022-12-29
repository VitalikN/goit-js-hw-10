import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

//  Notify.success;
// Notify.failure;
// https://restcountries.com/v3.1/name/{name}

// ВІДПОВІДЬ ФІЛЬТРА
// Ви можете відфільтрувати вихідні дані свого запиту, щоб включити лише вказані поля.
// https://restcountries.com/v2/{service}?fields={field},{field},{field}

// fetchCountries(name);
const search = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

search.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(evt) {
  //   console.log(evt.target.value);
  fetchCountries(evt.target.value.trim())
    .then(data => createMarkup(data))
    .catch(err => {
      //   if (Error.statusText === '404') {
      Notify.failure('Oops, there is no country with that name');
      //   }
      list.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}
//

function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText === '404');
    }
    return resp.json();
  });
}

//

function createMarkup(name) {
  console.log(name);

  const markup = name.map(
    ({ name: { official }, capital, flags: { svg } }) =>
      `   <li>
        <h2 class="country__titel">
        <img src="${svg}" alt="${capital}" width = '30px' />
        ${official}</h2>
      </li>`
  );
  //   const listLanguages = languages.map(({ name }) => name).join(', ');
  const info = name.map(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => `   <div>
  <h2 class="country__titel">
  <img src="${svg}" alt="${capital}" width = '30px' /> ${official}</h2>
  <h3 class="country__subject">Capital: ${capital}</h3>
  <p class="country__text">Population: ${population}</p>
 
  <p class="country__text">Languages: ${languages}</p>
</div>`
  );
  if (name.length === 1) {
    countryInfo.innerHTML = info.join(' ');
    list.innerHTML = '';
  } else if (name.length > 1 && name.length <= 10) {
    list.innerHTML = markup.join(' ');
    countryInfo.innerHTML = '';
  }
  if (name.length > 10) {
    list.innerHTML = '';
    Notify.success(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}
