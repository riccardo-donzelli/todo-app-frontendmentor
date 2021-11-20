const body = document.body;
const main = document.getElementById("main");
const toggle = document.getElementById("theme-toggle");
const iconTheme = document.getElementById("icon-box");
const lastLine = document.getElementById("last-line");
const filtersSection = document.getElementById("filters");
const filtersLarge = document.querySelector("[data-filter-large]");
// List & items
const listItems = document.getElementsByClassName("list-item");
const listItemsArray = document.querySelectorAll("#list li");
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
        newItem.classList.add("draggable");
        list.appendChild(newItem);
    }
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
    counter();
}

function clearAllCompleted() {
    [...listItems].map(function(el) {
        if (el.classList.contains("completed")) {
            list.removeChild(el);
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

// EVENT LISTENERS
toggle.addEventListener("click", themeSwitch);
enterInput.addEventListener("click", todo);
input.addEventListener("keyup", pressEnter);
list.addEventListener("click", cancelTodo);
list.addEventListener("click", completedTodo);
list.addEventListener("mouseover", showCancelItem);
filtersSection.addEventListener("click", filter);
filtersLarge.addEventListener("click", filter);
clearCompleted.addEventListener("click", clearAllCompleted);

// ===========================================================
// DRAG & DROP FUNCTIONALITY:
