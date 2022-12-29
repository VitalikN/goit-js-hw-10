import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

search.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(evt) {
  fetchCountries(evt.target.value.trim())
    .then(data => createMarkup(data))
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
      list.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function createMarkup(name) {
  const markup = name.map(
    ({ name: { official }, capital, flags: { svg } }) =>
      `   <li class="country" >
          <img src="${svg}" alt="${capital}" width = '30px' />
        <h2 class="country__titel">
    
        ${official}</h2>
      </li>`
  );

  const info = name.map(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => `   <div>
     <div class="country">
    <img src="${svg}" alt="${capital}" width = '30px' />
  <h2 class="country__titel">  ${official}</h2> </div>
  <h3 class="country__subject">Capital: ${capital}</h3>
  <p class="country__text"><span class="country__span">Population:</span> ${population}</p>
 
   <ul class="country__text country__languages "><span class="country__span">Languages:</span> ${Object.values(
     languages
   )
     .map(el => `<li>${el} </li>`)
     .join(',  ')}</ul>

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
