document.addEventListener("DOMContentLoaded", function() {
    
    const bookURL = "http://localhost:3000/books"
    const list = document.getElementById("list")
    const panel = document.getElementById("show-panel")

    function showBook(e) {
        getBook(e).then(book => {
            const container = `<div>
                <img src="${book.img_url}">
                <h1>${book.title}</h1>
                <h2>${book.author}</h2>
                <p>${book.description}</p>
                <ul>
                ${book.users.map(user => `<li>${user.username}</li>`).join('')}
                </ul>
                
            </div>`
            const button = document.createElement('button')
        
            
            button.innerText = 'LIKE'
            if (book.users[book.users.length -1].id == 1) {
                button.innerText = 'UNLIKE'
            }
            console.log(button.innerText)
            button.dataset.bookId = book.id
            panel.innerHTML = container
            panel.appendChild(button)
        })

    }

    function getBook(e) {
        return fetch(bookURL + `/${e.target.dataset.bookId}`)
            .then(response => response.json())
    }    
    //add fetched book titles to ul
    function listBooks(books) {
        books.forEach(book => {
            const item = document.createElement("li")
            item.dataset.bookId = book.id
            item.textContent = book.title
            item.addEventListener("click", showBook)
            list.appendChild(item)
        })
    }
    //fetch books from URL
    function getBooks() {
        fetch(bookURL)
            .then(response => response.json())
            .then(books => listBooks(books))
    }

    function changeLikes(e, id, body) {
        fetch(bookURL + `/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(() => showBook(e))
    }

    getBooks()

    function handleClick(e) {
        if(e.target.tagName == "BUTTON") {
            console.log(e.target)
            const id = e.target.dataset.bookId
            if(e.target.innerText == 'LIKE') {
                
                getBook(e).then(book => {
                    const users = book.users
                    const body = {users: [...users, {"id":1, "username":"pouros"}]}
                    changeLikes(e, id, body)
                })
                
            } else {
                console.log('unlike the book')
                getBook(e).then(book => {
                    book.users.pop()
                    const body = {users: [...book.users]}
                    changeLikes(e, id, body)
                })
            }
        }
    }

    panel.addEventListener("click", handleClick)




});
