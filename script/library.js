let libraryList = []
let movieContainer = document.querySelector(".movies__list")
let favoriteMovie = document.querySelector(".favorite-container")
let filterMovie = document.querySelector("select")

function render(data) {
    movieContainer.innerHTML = ""
    data.forEach(movie => {
        movieContainer.innerHTML += `<div class="movie__card" data-id=${movie.imdbID}>
        <div class="movie__card-img">
        <img src=${movie.Poster != "N/A"&&movie.Poster?movie.Poster:"https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"} alt="">
        </div>
        <h3>${movie.Title}</h3>
        <div class="movie__card-nav row">
            <button class="favorite-btn ${movie.favorite?"active-favorite": ""}"></button>
            <input class="watched-movie" type="checkbox" ${movie.watched ? "checked":""}>
            <button class="delete-btn"></button>
        </div>
        </div>`
    })
}

function saveData(){
    localStorage.setItem("libraryMovie", JSON.stringify(libraryList))
}

function getData(){
    let dataList = JSON.parse(localStorage.getItem("libraryMovie"))
    if(dataList){
        libraryList = dataList
        libraryList.forEach((element) => {
            if(element.favorite){
                renderFavorite(element)
            }
        })
        render(libraryList)
    }
}

getData()

movieContainer.addEventListener("click", (event) => {
    let target = event.target
    let clickedCard = target.closest(".movie__card")
    let movieId = clickedCard.dataset.id
    if(target==target.closest(".delete-btn")){
        deleteMovie(movieId,clickedCard)
    }
    if(target == target.closest(".favorite-btn")){
        toggleFavorite(movieId)
    }
    if(target==target.closest(".watched-movie")){
        toggleWatched(movieId)
    }
})

function deleteMovie(id,card){
    let index = libraryList.findIndex(element => element.imdbID == id)
    if(libraryList[index].favorite){
        favoriteMovie.innerHTML=""
    }
    libraryList.splice(index,1)
    saveData()
    render(libraryList)
}

function toggleFavorite(id){
    libraryList.forEach(element=>{
        if(element.imdbID != id){
            element.favorite = false
        }else{
            if(element.favorite == true){
                element.favorite = false
                favoriteMovie.innerHTML = ""
            }else{
                element.favorite = true
                renderFavorite(element)
            }
        }
    })
    saveData()
    render(libraryList)
}

function toggleWatched(id){
    libraryList.forEach(element=>{
        if(element.imdbID===id){
            element.watched = !element.watched
        }
    })
    saveData()
}

function renderFavorite(data){
    favoriteMovie.innerHTML = `
    <h1 class="favorite__movie-title">Favorite movie</h1>
    <div class="row">
    <img src=${data.Poster != "N/A"&&data.Poster?data.Poster:"https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"} alt="">
    <div class="modal__info">
        <h2>${data.Title}</h2>
        <ul class="li">
            <li>Actors: <span>${data.Actors}</span></li>
            <li>Budget: <span>${data.BoxOffice}</span></li>
            <li>Country: <span>${data.Country}</span></li>
            <li>Director: <span>${data.Director}</span></li>
            <li>Genre: <span>${data.Genre}</span></li>
            <li>Data: <span>${data.Released}</span></li>
            <li>Type: <span>${data.Type}</span></li>
        </ul>
    </div>
    <p class="modal__plot">${data.Plot}</p>
</div>`
}

filterMovie.addEventListener("change", (event)=>{
    if(event.target.value === "standart" && libraryList.length >0){
        render(libraryList)
    }else if(event.target.value === "watched" && libraryList.length >0){
        let watchedList = libraryList.slice().sort((a,b)=> {
            if(a.watched === b.watched){
                return 0
            }
            return a.watched?-1:1
        })
        render(watchedList)
    }else if(event.target.value === "unwatched" && libraryList.length >0){
        let unwatchedList = libraryList.slice().sort((a,b)=> {
            if(a.watched === b.watched){
                return 0
            }
            return a.watched?1:-1
        })
        render(unwatchedList)
    }
})