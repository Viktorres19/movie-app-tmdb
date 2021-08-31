//TMDB
//не понял как создавать API ключ на сайте
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
//base url
const BASE_URL = 'https://api.themoviedb.org/3';
//I join base url to additional address + api key
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
//це змінна для формування адреси при пошуку кіно-стрічки
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [{
		"id": 28,
		"name": "Action"
	},
	{
		"id": 12,
		"name": "Adventure"
	},
	{
		"id": 16,
		"name": "Animation"
	},
	{
		"id": 35,
		"name": "Comedy"
	},
	{
		"id": 80,
		"name": "Crime"
	},
	{
		"id": 99,
		"name": "Documentary"
	},
	{
		"id": 18,
		"name": "Drama"
	},
	{
		"id": 10751,
		"name": "Family"
	},
	{
		"id": 14,
		"name": "Fantasy"
	},
	{
		"id": 36,
		"name": "History"
	},
	{
		"id": 27,
		"name": "Horror"
	},
	{
		"id": 10402,
		"name": "Music"
	},
	{
		"id": 9648,
		"name": "Mystery"
	},
	{
		"id": 10749,
		"name": "Romance"
	},
	{
		"id": 878,
		"name": "Science Fiction"
	},
	{
		"id": 10770,
		"name": "TV Movie"
	},
	{
		"id": 53,
		"name": "Thriller"
	},
	{
		"id": 10752,
		"name": "War"
	},
	{
		"id": 37,
		"name": "Western"
	}
]

const header = document.querySelector('header');
const main = document.querySelector('#main');
const form = document.querySelector('#form');
const search = document.querySelector('#search');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const current = document.querySelector('#current');
const selectList = document.querySelector('#list');
const selectWrap = document.querySelector('#select-wrap');

let selectedGenre = [];
let genresList;
//to choose and save option from select
let selectedValue;

// (3rd lesson)
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let totalPages = 100;


//функція встановлює жанри для фільтрування по жанрах:
const tagsEl = document.querySelector('#tags');
setGenre();
//
function setGenre() {
	tagsEl.innerHTML = '';
	selectList.innerHTML = '';
	selectList.innerHTML = '<option selected disabled>Choose a movie genre...</option>';
	//Пробігаюсь по жанрах 
	genres.forEach(genre => {
		//добавляємо дів
		const t = document.createElement('div');
		//create option
		const option = document.createElement('option');
		t.classList.add('tag');
		//add value (genre.name) instead of classList
		option.value = genre.name;
		t.id = genre.id;
		//maybe add id to each option
		option.id = genre.id;
		t.innerText = genre.name;
		//add innerText
		option.innerText = genre.name;
		

		t.addEventListener('click', (e) => {
			if (!e.target.classList.contains('highlight')) {
				e.target.classList.add('highlight');
				selectedGenre.push(e.target.id);
			}
			
			getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
			highlightSelection()
		})
		tagsEl.append(t);
		//add option to list of selects
		selectList.append(option);
	})

}




//Засвітити відповідний тег в облаці тегу
const highlightTagCloud = (selectedGenre) => {
	const tagCloud = document.querySelectorAll('div.tag');
	console.log(tagCloud.length);
	tagCloud.forEach(item => {
		if(selectedGenre.includes(+(item.id))) {
			console.log("1");
			item.classList.add('highlight');
			console.log(item);
		}
	});
}

//Якщо селект міняється
selectList.addEventListener('change', (e) => {
	//змінна буде дорівнювати значенню цілі
	const selectedOption = e.target.value;
	/*створюємо змінну і присвоюємо їй значення за допомогою find в массиве genres
	тут буде проходити тільки рівність*/
	const foundValue = genres.find(element => selectedOption.toLowerCase() === element.name.toLowerCase());
	//якщо умова задовольняє
	if (foundValue) {
		//тоді в пустий масив добавляємо значення цього айді
		selectedGenre.push(foundValue.id);
	}
	//кожного разу запускаємо функцію знищення дублікатів
	selectedGenre = removeDuplicates(selectedGenre);
	console.log(selectedGenre);
	//та запускаємо функцію запиту нових фільмів з потрібним параметром
	getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
	//також запускаємо функцію підсвітки відміченного
	highlightSelection();
	highlightTagCloud(selectedGenre);
});

//функція знищення дублікатів
function removeDuplicates(data) {
	return data.filter((value, index) => data.indexOf(value) === index)
}

//+функція, що підсвічує всі обрані категорії в селекті
function highlightSelection() {
	const options = document.querySelectorAll('option');
	clearBtn(options);
	//якщо масив вибраних жанрів не дорівнює 0
	if(selectedGenre.length != 0) {
		//тоді ми пробігаємо по ньому
		selectedGenre.forEach(id => {
			const highlightedTag = document.getElementById(id);
			//і кожному елементу з відповідним id добавляэмо класс підсвітки
			highlightedTag.classList.add('highlight');
		})
	}
}

function clearBtn(options) {
	//Перевірка, щоб не добавляти іще одну кнопку очищення, якщо одна вже є:
	let clearBtn = document.querySelector('#clear');
	if(clearBtn) {
		clearBtn.classList.add('highlight')
	}	else {
		let clear = document.createElement('div');
		let clearSelect = document.createElement('div');
		clear.classList.add('tag', 'highlight');
		clearSelect.classList.add('tag', 'highlight');
		clear.id = 'clear';
		clearSelect.id = 'clear-select';
		clear.innerText = 'Clear x';
		clearSelect.innerText = 'Clear x';
		clear.addEventListener('click', () => {
			selectedGenre = [];
			setGenre();
			getMovies(API_URL);
			options.forEach(option => {
				option.classList.remove('highlight')
			});
			clearSelect.remove();
		});
		clearSelect.addEventListener('click', () => {
			selectedGenre = [];
			setGenre();
			getMovies(API_URL);
			options.forEach(option => {
				option.classList.remove('highlight')
			});
			clearSelect.remove();
		})
		tagsEl.append(clear);
		selectWrap.append(clearSelect);
	}
}

//+при початковому завантаженні стрінки функція getMovies завжди буде запускатися, але з параметром
getMovies(API_URL);

//+функція отримання фільмів по API
function getMovies(url) {
	//значення lastUrl завжди буде дорівнювати вхідному параметру при запуску
	lastUrl = url;
	//(2) за допомогою фетча по відповідному ЮРЛ => отримую результат => результат в json
	fetch(url).then(res => res.json()).then(data => {
		//умова. Що показувати, коли немає кіно за вибраними результатами: (3) далі запускаю функцію показу результатів передаючи туда інфу (тільки результати)
		if(data.results.length) {
			//з цієї функції ми запускаємо функцію показу фільмів
			showMovies(data.results)
			currentPage = data.page;
			nextPage = currentPage + 1;
			prevPage = currentPage - 1;
			totalPages = data.total_pages;

			current.innerText = currentPage;

			if(currentPage <= 1) {
				prev.classList.add('disabled');
				next.classList.remove('disabled');
			} else if(currentPage >= totalPages) {
				prev.classList.remove('disabled');
				next.classList.add('disabled');
			} else {
				prev.classList.remove('disabled');
				next.classList.remove('disabled');
			}
		} else {
			//в разі коли критерії в пошуковому запиті не задовольняють
			main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
		}
	})
}

function showMovies(data) {
	main.innerHTML = '';
	/* (4) роблю для кожного елементу створюю карточку */
	data.forEach(movie => {
		/* (5) деструктурирувальне присвоювання з об'єкту movie */
		const {title, poster_path, vote_average, overview} = movie
		const movieEl = document.createElement('div');
		movieEl.classList.add('movie');
		/* Перевірка якщо немає зображення, застосовувати плейсхолдер*/
		movieEl.innerHTML = `
			<img src="${poster_path ? IMG_URL+poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">

			<div class="movie-info">
				<h3>${title}</h3>
				<span class="${getColor(vote_average)}">${vote_average}</span>
			</div>

			<div class="overview">
				<h3>Overview</h3>
				${overview}
			</div>
		`

		main.appendChild(movieEl);
	});
}

function getColor(vote) {
	if(vote>= 8){
		return 'limegreen'
	} else if(vote >= 5){
		return 'darkorange'
	} else {
		return 'crimson'
	}
}

//Function onsubmit of the form
form.addEventListener('submit', (e) => {
	e.preventDefault();

	const searchTerm = search.value;
	search.value = '';
	/* При пошуку також обнуляємо фільтри */
	selectedGenre = [];
	setGenre();
	/* якщо searchTerm є(переробив тернаркою):
	запускаю функцію взяття кінострічок, але з іншим складеним параметром: */
	(searchTerm) ? getMovies(searchURL+'&query='+searchTerm) : getMovies(API_URL);
})

//+функція підсколювання наверх коли клік при перегортанні сторінки назад
prev.addEventListener('click', () => {
	//якщо значення більше 0
	if(prevPage > 0) {
		//визиваємо функцію з параметром prevPage
		pageCall(prevPage);
		//плавно скролимо наверх
		header.scrollIntoView({behavior: 'smooth'});
	}
})

//+функція підсколювання наверх коли клік при перегортанні сторінки вперед
next.addEventListener('click', () => {
	//якщо значення nextPage менше або дорівнює загальній кількості сторінок
	if(nextPage <= totalPages) {
		//визиваємо функцію з параметром nextPage
		pageCall(nextPage);
		//плавно скролимо наверх
		header.scrollIntoView({behavior: 'smooth'});
	}
})

//+функція виклику сторінки при пагінації
function pageCall(page) {
	//створюємо змінну, та присвоюємо їй як значення відрізану останню адресу
	let urlSplit = lastUrl.split('?');
	let queryParams = urlSplit[1].split('&');
	let key = queryParams[queryParams.length - 1].split('=');
	//якщо перший символ не дорівнює змінній page
	if (key[0] != 'page') {
		//тоді змінна url буде засновуватись на змінній page
		let url = lastUrl + '&page=' + page
		//буде запускатись функція getMovies саме з цим складеним параметром
		getMovies(url);
		//в іншому випадку
	} else {
		key[1] = page.toString();
		let a = key.join('=');
		queryParams[queryParams.length - 1] = a;
		let b = queryParams.join('&');
		let url = urlSplit[0] + '?' + b;
		getMovies(url);
	}
}