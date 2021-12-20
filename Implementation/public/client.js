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

function addToCart() {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/books', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.responseType = "json";
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            alert('Added to cart');
        } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            alert('Failed adding to cart');
        }
    }
    let UserData = { 'isbn': window.location.pathname.slice(7) };
    xhttp.send(JSON.stringify(UserData)); //Send ISBN of book to the server
}

function loginUser() {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/users', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.responseType = "json";
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            alert('Logged in as user');
        } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            alert('Failed to log in');
        }
    }
    let UserData = { 'username': 'user', 'password': 'password' };
    xhttp.send(JSON.stringify(UserData)); //Send username/password to the server and login
}

function loginOwner() {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/owners', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.responseType = "json";
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            alert('Logged in as owner');
        } else if (xhttp.readyState == 4 && xhttp.status == 500) {
            alert('Failed to log in');
        }
    }
    let UserData = { 'username': 'admin', 'password': 'admin' };
    xhttp.send(JSON.stringify(UserData)); //Send username/password to the server and login 
}

