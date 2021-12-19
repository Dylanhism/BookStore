function ISBN() {
    let ISBN = document.getElementById('ISBN').value;
    if (ISBN != '') {
        window.location.href = '/?ISBN='+ISBN;
    }
}

function bookName() {
    let name = document.getElementById('name').value;
    if (name != '') {
        window.location.href = '/?name='+name;
    }
}

function genre() {
    let genre = document.getElementById('genre').value;
    if (genre != '') {
        window.location.href = '/?genre='+genre;
    }
}

function author() {
    let author = document.getElementById('author').value;
    if (author != '') {
        window.location.href = '/?author='+author;
    }
}
