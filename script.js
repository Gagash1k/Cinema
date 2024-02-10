let API = "https://www.omdbapi.com"
let KEY = "f43588a4"
let modal = document.querySelector(".modal")
let modalContent = document.querySelector(".modal__content")
let closeBtn = document.querySelector(".modal__close")
let searchedTitle = document.querySelector("h1 span")
let addBtn = document.querySelector(".modal__add")
let libraryList = []
let modalMovie 

let form = document.querySelector(".header__search")
let inputSearch = document.querySelector(".header__search input")

let movieList = document.querySelector(".movies__list")
let moviePagination = document.querySelector(".movie__pagination")
let serarchedValue
let totalPage = 0
let curentPage = 1

function render(data) {
    movieList.innerHTML = ""
    data.Search.forEach(movie => {
        movieList.innerHTML += `<div class="movie__card" data-id=${movie.imdbID}>
        <div class="movie__card-img">
        <img src=${movie.Poster != "N/A"&&movie.Poster?movie.Poster:"https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"} alt="">
        </div>
        <h3>${movie.Title}</h3>
        </div>`
    })
    renderPag()
}

moviePagination.addEventListener("click", (event) => {
    if(event.target.closest("li")){
        curentPage = +event.target.innerHTML
        let searchUrl = `${API}/?apikey=${KEY}&s=${serarchedValue}&page=${curentPage}`
        fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            totalPage = +Math.ceil(data.totalResults / 10)
            render(data)})
    }
})

form.addEventListener("submit", (event) => {
    event.preventDefault()
    if (inputSearch.value.length >= 3 ){
        serarchedValue = inputSearch.value.trim()
        curentPage = 1
        searchedTitle.innerHTML = inputSearch.value
        let searchUrl = `${API}/?apikey=${KEY}&s=${serarchedValue}&page=${curentPage}`

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                totalPage = +Math.ceil(data.totalResults / 10)
                render(data)})
    }
})

function renderPag() {
    moviePagination.innerHTML = ""
    if(curentPage <=4) {
        for (let i = 1; i <=6; i++) {
            moviePagination.innerHTML += `<li class="${curentPage == i ? "active-page" : ""}">${i}</li>`
        }
        moviePagination.innerHTML += `<span>...</span>`
        moviePagination.innerHTML += `<li>${totalPage}</li>`
    }

    if (curentPage > 4 && curentPage < totalPage - 3) {
        {
            moviePagination.innerHTML += `<li>1</li>`
            moviePagination.innerHTML += `<span>...</span>`

            console.log(curentPage - 1)
            console.log(curentPage + 1)

            for (let i = curentPage - 1; i <= curentPage + 1; i++) {
                moviePagination.innerHTML += `<li class="${curentPage == i ? "active-page" : ""}">${i}</li>`
            }

            moviePagination.innerHTML += `<span>...</span>`
            moviePagination.innerHTML += `<li>${totalPage}</li>`
        }
    }

    if (curentPage >= totalPage - 3) {
        moviePagination.innerHTML += `<li>1</li>`
        moviePagination.innerHTML += `<span>...</span>`

        for (let i = totalPage - 5; i <= totalPage; i++) {
            moviePagination.innerHTML += `<li class="${curentPage == i ? "active-page" : ""}">${i}</li>`
        }
    }
}

movieList.addEventListener("click", (event) => {
    let clickedCard = event.target.closest(".movie__card")
    if(clickedCard){
        let urlId = `${API}/?apikey=${KEY}&i=${clickedCard.dataset.id}`
        modal.classList.add("active-modal")
        fetch(urlId)
        .then(response => response.json())
        .then(data => renderMovieById(data))
    }
})

function renderMovieById(data){
    modalMovie = data
    addBtn.innerHTML = `${libraryList.find(el => el.imdbID === modalMovie.imdbID) ? "In library" : "Add to library"}`
    modalContent.innerHTML = ""
    modalContent.innerHTML = ` <div class="row">
    <img src=${data.Poster != "N/A"&&data.Poster?data.Poster:"https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"} alt="">
    <div class="modal__info">
        <h2>${data.Title}</h2>
        <ul>
            <li>Actors: <span>${data.Actors}</span></li>
            <li>Budget: <span>${data.BoxOffice}</span></li>
            <li>Country: <span>${data.Country}</span></li>
            <li>Director: <span>${data.Director}</span></li>
            <li>Genre: <span>${data.Genre}</span></li>
            <li>Data: <span>${data.Released}</span></li>
            <li>Type: <span>${data.Type}</span></li>
        </ul>
    </div>
</div>
<p class="modal__plot">${data.Plot}</p>`
}

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active-modal")
    setTimeout(function(){
        modalContent.innerHTML = ` <div class="modal__content-spinner">
        <img src="/img/spinner.svg" alt="">
    </div>`
    },300)
})

addBtn.addEventListener("click", () => {
    if(!libraryList.find(movie => movie.imdbID === modalMovie.imdbID)){
        modalMovie.favorite = false
        modalMovie.watched = false
        libraryList.push(modalMovie)
        addBtn.innerHTML = "In library"
      saveData()
    }
})

function saveData(){
    localStorage.setItem("libraryMovie", JSON.stringify(libraryList))
}

function getData(){
    let dataList = JSON.parse(localStorage.getItem("libraryMovie"))
    if(dataList){
        libraryList = dataList
    }
}

getData()

let openSearchBtn = document.querySelector(".open__search")
let closeSearchBtn = document.querySelector(".close__search")

openSearchBtn.addEventListener("click", () => {
    form.classList.add("active-search")
})

closeSearchBtn.addEventListener("click", () => {
    form.classList.remove("active-search")
})