const body = document.body;
const main = document.getElementById("main");
const toggle = document.getElementById("theme-toggle");
const iconTheme = document.getElementById("icon-box");
const lastLine = document.getElementById("last-line");
const filtersSection = document.getElementById("filters");
const filtersLarge = document.querySelector("[data-filter-large]");
// List & items
const listItems = document.getElementsByClassName("list-item");
const draggables = document.querySelectorAll('.draggable');
let list = document.getElementById("list");
// Inputs & buttons
const enterInput = document.getElementById("enter-btn");
const cancelItem = document.getElementsByClassName("cancelThisItem");
const clearCompleted = document.getElementById("clear-completed");
let input = document.getElementById("input-field");
let counterItems = document.getElementById("number");

// FUNCTIONS
function themeSwitch() {
    body.classList.toggle("body-dark");
    main.classList.toggle("bg-dark");
    [...listItems, lastLine, filtersSection, input].map(el => el.classList.toggle("list-item-dark"));
    [...cancelItem].map(el => el.classList.toggle("cancelThisItem-dark"));
    iconTheme.classList.toggle("sun-icon");
}

// to submit the input with enter button on keyboard:
function pressEnter(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        enterInput.click();
    }
}

function counter() {
    let activeItems = [...listItems].filter(el => !el.className.includes("completed"))
    counterItems.innerText = activeItems.length;
}
counter();

function todo() {
    let inputValue = input.value;
    if (inputValue.length > 0) {
        let newItem = document.createElement("li");
        newItem.innerHTML = inputValue + 
            '<span><img src="./images/icon-cross.svg" class="cancelThisItem"></span>';
        //make the new item draggable adding the attribute:
        let dragAttribute = document.createAttribute("draggable");
        dragAttribute.value = "true";
        newItem.setAttributeNode(dragAttribute);
        newItem.classList.add("list-item");
        if (toggle.checked) {
            newItem.classList.add("list-item-dark");
        }
        newItem.classList.add("draggable");
        list.appendChild(newItem);
    }
    // save new todo item in local storage
    saveLocalTodos(inputValue);
    // reset input field
    input.value = "";
    // update counter
    counter();
}

function completedTodo(e) {
    let target = e.target;
    target.classList.toggle("completed");
    counter();
}

function resetInput() {
    inputValue = "";
}

function showCancelItem(e) {
    let target = e.target;
    let grandchild = target.lastChild.firstChild;
    grandchild.classList.toggle("show");
}

function cancelTodo(e) {
    let target = e.target;
    let grandparent = target.parentNode.parentNode;
    list.removeChild(grandparent);
    removeLocalTodos(grandparent);
    counter();
}

function clearAllCompleted() {
    [...listItems].map(function(el) {
        if (el.classList.contains("completed")) {
            list.removeChild(el);
            removeLocalTodos(el);
        }
    })
    counter();
}

function filter(e) {
    let target = e.target;
    if (target.innerText == "Completed") {
        [...listItems].map(function(el) {
            if (!el.classList.contains("completed")) {
                el.classList.add("hide");
            } else if (el.classList.contains("completed")) {
                el.classList.remove("hide");
            }
        })   
    }
    else if (target.innerText == "Active") {
        [...listItems].map(function(el) {
            if (el.classList.contains("completed")) {
                el.classList.add("hide");
            } else if (!el.classList.contains("completed")) {
                el.classList.remove("hide");
            }
        })
    }
    else if (target.innerText == "All") {
        [...listItems].map(function(el) {
            el.classList.remove("hide");
        })
    }  
}

// FOLLOWING LOCAL STORAGE FUNCTIONS
function saveLocalTodos(todo) {
    let todos;

    if (localStorage.getItem("todos") === null ) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    let todos;

    if (localStorage.getItem("todos") === null ) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.forEach( function(todo) {
        let newTodo = document.createElement("li");
        newTodo.innerHTML = todo + 
            '<span><img src="./images/icon-cross.svg" class="cancelThisItem"></span>';
        //make the new item draggable:
        let dragAttribute = document.createAttribute("draggable");
        dragAttribute.value = "true";
        newTodo.setAttributeNode(dragAttribute);
        newTodo.classList.add("list-item");
        if (toggle.checked) {
            newTodo.classList.add("list-item-dark");
        }
        newTodo.classList.add("draggable");
        list.appendChild(newTodo);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    let item = todo.children[0].innerText;
    const todoIndex = todos.indexOf(item);
    todos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// DRAG & DROP FUNCTIONALITY:
function dragAndDrop() {
    const listItemsArray = document.querySelectorAll("#list li");
    listItemsArray.forEach(el => {
        el.addEventListener('dragstart', () => {
            el.classList.add('dragging');
        })
    
        el.addEventListener('dragend', () => {
            el.classList.remove('dragging');
        })
    })
    
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(e.clientY);
        // current dragging element is the only has dragging class
        const draggable = document.querySelector('.dragging');

        console.log(afterElement)

        // drag & drop finally:
        if (afterElement == null) {
            list.appendChild(draggable);
        } else {
            list.insertBefore(draggable, afterElement);
        }
    })
    
    function getDragAfterElement(y) {
        const draggableElements = [...list.querySelectorAll('.draggable:not(.dragging)')];
    
        return draggableElements.reduce((closest, child) => {
            // I need measure of the DOM rectangle containing each list item:
            const box = child.getBoundingClientRect();
            // to position us at the center of the box:
            const offset = y - box.top - box.height / 2;
    
            /*
            when we are dragging an element and we are below another element we get positive offset, 
            above we get negatives instead.
            We care only about negative offset values, because we just need to know when we are
            dragging something over another list item.        
            */
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

// ===========================================================
// EVENT LISTENERS
// get todos list if there are any in Local Storage:
document.addEventListener("DOMContentLoaded", getTodos);
toggle.addEventListener("click", themeSwitch);
enterInput.addEventListener("click", todo);
input.addEventListener("focus", () => input.setAttribute("placeholder", ''));
input.addEventListener("blur", () => input.setAttribute("placeholder", 'Create a new todo...'));
input.addEventListener("keydown", pressEnter);
list.addEventListener("click", cancelTodo);
list.addEventListener("click", completedTodo);
list.addEventListener("mouseover", showCancelItem);
filtersSection.addEventListener("click", filter);
filtersLarge.addEventListener("click", filter);
clearCompleted.addEventListener("click", clearAllCompleted);
