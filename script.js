//SELECTORS
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoLists = document.querySelectorAll(".todo-list");
const alldayList = document.querySelector(".allday");
const morningList = document.querySelector(".morning");
const afternoonList = document.querySelector(".afternoon");
const eveningList = document.querySelector(".evening");
const resetButton = document.getElementById("reset-button");
const completedContainer = document.querySelector(".completed-container");
const toggleButton = document.getElementById("completedToggle");
const during = document.getElementsByName("during");

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", loadDate);
todoButton.addEventListener("click", addTodo);
todoLists.forEach((todolist) => {
  todolist.addEventListener("click", mainListEvents);
});
completedContainer.addEventListener("click", completedListEvents);
toggleButton.addEventListener("click", hideCompletedTasks);
resetButton.addEventListener("click", resetForm);
document.addEventListener("DOMContentLoaded", getTodos);

//FUNCTIONS

//Load Date
function loadDate() {
  const today = new Date();

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date =
    weekday[today.getDay()] +
    ", " +
    month[today.getMonth()] +
    " " +
    today.getDate() +
    ", " +
    today.getFullYear() +
    " ";
  document.getElementById("date").textContent = date;
}

//Radio button value
function displayRadioValue() {
  for (i = 0; i < during.length; i++) {
    if (during[i].checked) {
      let checked = during[i].value;
      return checked;
    }
  }
}

//Add to do
function addTodo(event) {
  if (todoInput.value === "") {
    event.preventDefault();
  } else {
    //Prevent form from submitting
    event.preventDefault();

    //Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("fadein");

    //Checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Create LI
    const newToDo = document.createElement("li");
    newToDo.innerText = todoInput.value;
    newToDo.classList.add("todo-item");
    todoDiv.appendChild(newToDo);

    //Trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    let radioValue = displayRadioValue();

    if (radioValue === "allday") {
      todoDiv.classList.add("allday-todo");
      alldayList.appendChild(todoDiv);
      saveLocalalldayTodos(todoInput.value);
    } else if (radioValue === "morning") {
      todoDiv.classList.add("morning-todo");
      morningList.appendChild(todoDiv);
      saveLocalMorningTodos(todoInput.value);
    } else if (radioValue === "afternoon") {
      todoDiv.classList.add("afternoon-todo");
      afternoonList.appendChild(todoDiv);
      saveLocalAfternoonTodos(todoInput.value);
    } else if (radioValue === "evening") {
      todoDiv.classList.add("evening-todo");
      eveningList.appendChild(todoDiv);
      saveLocalEveningTodos(todoInput.value);
    }

    //Clear todo Input Value
    todoInput.value = "";
  }
}

//MAIN LIST EVENTS
function mainListEvents(e) {
  //specific div that is clicked
  let item = e.target;

  //selects parent todo div
  let todo = item.parentElement;

  //text inside todo
  let todoChildren = todo.children[1].innerText;

  //Toggles checkmark class style
  if (item.classList[0] === "complete-btn") {
    todo.classList.toggle("completed");
    item.classList.toggle("check-completed");
  }

  //append to completed from main list, save local, removes local from other lists
  if (todo.classList.contains("completed") === true) {
    todo.classList.remove("fadein");
    todo.classList.add("fadeout");
    completedContainer.appendChild(todo);
    saveLocalCompletedTodo(todoChildren);

    if (todo.classList.contains("allday-todo") === true) {
      removeLocalalldayTodos(todo);
    } else if (todo.classList.contains("morning-todo") === true) {
      removeLocalMorningTodos(todo);
    } else if (todo.classList.contains("afternoon-todo") === true) {
      removeLocalAfternoonTodos(todo);
    } else if (todo.classList.contains("evening-todo") === true) {
      removeLocalEveningTodos(todo);
    }
  }

  //Delete and remove once from main list
  if (item.classList[0] === "trash-btn") {
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //Delete from local storage from main list
  if (todo.classList.contains("fall") === true) {
    if (todo.classList.contains("allday-todo") === true) {
      removeLocalalldayTodos(todo);
    } else if (todo.classList.contains("morning-todo") === true) {
      removeLocalMorningTodos(todo);
    } else if (todo.classList.contains("afternoon-todo") === true) {
      removeLocalAfternoonTodos(todo);
    } else if (todo.classList.contains("evening-todo") === true) {
      removeLocalEveningTodos(todo);
    }
  }
}

//COMPLETED LIST EVENTS
function completedListEvents(e) {
  //specific div that is clicked
  let item = e.target;

  //selects parent todo div
  let todo = item.parentElement;

  //text inside todo
  let todoChildren = todo.children[1].innerText;

  //Toggles checkmark class style
  if (item.classList[0] === "complete-btn") {
    todo.classList.toggle("completed");
    item.classList.toggle("check-completed");
  }

  //append back to main list, resave local storage
  if (todo.classList.contains("completed") === false) {
    removeLocalCompletedTodos(todo);
    todo.classList.add("fadein");
    todo.classList.remove("fadeout");
    if (todo.classList.contains("allday-todo") === true) {
      alldayList.appendChild(todo);
      saveLocalalldayTodos(todoChildren);
    } else if (todo.classList.contains("morning-todo") === true) {
      morningList.appendChild(todo);
      saveLocalMorningTodos(todoChildren);
    } else if (todo.classList.contains("afternoon-todo") === true) {
      afternoonList.appendChild(todo);
      saveLocalAfternoonTodos(todoChildren);
    } else if (todo.classList.contains("evening-todo") === true) {
      eveningList.appendChild(todo);
      saveLocalEveningTodos(todoChildren);
    }
  }

  //Delete and remove once from main list
  if (item.classList[0] === "trash-btn") {
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //Delete from local storage from main list
  if (todo.classList.contains("fall") === true) {
    removeLocalCompletedTodos(todo);
  }
}

//Hide Completed Tasks
function hideCompletedTasks() {
  const plus = document.getElementById("plus");
  const minus = document.getElementById("minus");
  const toggleText = document.getElementById("completedToggle-text");

  completedContainer.classList.toggle("hide");

  if (completedContainer.classList.contains("hide") === true) {
    toggleText.innerText = "Show Completed";
    plus.style.display = "flex";
    minus.style.display = "none";
  }

  if (completedContainer.classList.contains("hide") === false) {
    toggleText.innerText = "Hide Completed";
    plus.style.display = "none";
    minus.style.display = "flex";
  }
}

//Remove child nodes from completed
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//Reset Form
function resetForm() {
  todoInput.value = "";

  for (i = 0; i < during.length; i++) {
    during[i].checked = false;
    during[0].checked = true;
  }

  let todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
    localStorage.clear();
  });

  removeAllChildNodes(completedContainer);

  if (completedContainer.classList.contains("hide") === true) {
    hideCompletedTasks();
  }
}

//Save local
function saveLocalalldayTodos(alldaytodo) {
  let allday;
  if (localStorage.getItem("allday") === null) {
    allday = [];
  } else {
    allday = JSON.parse(localStorage.getItem("allday"));
  }
  allday.push(alldaytodo);
  localStorage.setItem("allday", JSON.stringify(allday));
}

function saveLocalMorningTodos(morningtodo) {
  let morning;
  if (localStorage.getItem("morning") === null) {
    morning = [];
  } else {
    morning = JSON.parse(localStorage.getItem("morning"));
  }
  morning.push(morningtodo);
  localStorage.setItem("morning", JSON.stringify(morning));
}

function saveLocalAfternoonTodos(afternoontodo) {
  let afternoon;
  if (localStorage.getItem("afternoon") === null) {
    afternoon = [];
  } else {
    afternoon = JSON.parse(localStorage.getItem("afternoon"));
  }
  afternoon.push(afternoontodo);
  localStorage.setItem("afternoon", JSON.stringify(afternoon));
}

function saveLocalEveningTodos(eveningtodo) {
  let evening;
  if (localStorage.getItem("evening") === null) {
    evening = [];
  } else {
    evening = JSON.parse(localStorage.getItem("evening"));
  }
  evening.push(eveningtodo);
  localStorage.setItem("evening", JSON.stringify(evening));
}

function saveLocalCompletedTodo(completedtodo) {
  let completed;
  if (localStorage.getItem("completed") === null) {
    completed = [];
  } else {
    completed = JSON.parse(localStorage.getItem("completed"));
  }
  completed.push(completedtodo);
  localStorage.setItem("completed", JSON.stringify(completed));
}

//Delete local
function removeLocalalldayTodos(alldaytodo) {
  let allday;
  if (localStorage.getItem("allday") === null) {
    allday = [];
  } else {
    allday = JSON.parse(localStorage.getItem("allday"));
  }
  let todoIndex = alldaytodo.children[1].innerText;
  allday.splice(allday.indexOf(todoIndex), 1);
  localStorage.setItem("allday", JSON.stringify(allday));
}

function removeLocalMorningTodos(morningtodo) {
  let morning;
  if (localStorage.getItem("morning") === null) {
    morning = [];
  } else {
    morning = JSON.parse(localStorage.getItem("morning"));
  }
  let todoIndex = morningtodo.children[1].innerText;
  morning.splice(morning.indexOf(todoIndex), 1);
  localStorage.setItem("morning", JSON.stringify(morning));
}

function removeLocalAfternoonTodos(afternoontodo) {
  let afternoon;
  if (localStorage.getItem("afternoon") === null) {
    afternoon = [];
  } else {
    afternoon = JSON.parse(localStorage.getItem("afternoon"));
  }
  let todoIndex = afternoontodo.children[1].innerText;
  afternoon.splice(afternoon.indexOf(todoIndex), 1);
  localStorage.setItem("afternoon", JSON.stringify(afternoon));
}

function removeLocalEveningTodos(eveningtodo) {
  let evening;
  if (localStorage.getItem("evening") === null) {
    evening = [];
  } else {
    evening = JSON.parse(localStorage.getItem("evening"));
  }
  let todoIndex = eveningtodo.children[1].innerText;
  evening.splice(evening.indexOf(todoIndex), 1);
  localStorage.setItem("evening", JSON.stringify(evening));
}

function removeLocalCompletedTodos(completedtodo) {
  let completed;
  if (localStorage.getItem("completed") === null) {
    completed = [];
  } else {
    completed = JSON.parse(localStorage.getItem("completed"));
  }
  let todoIndex = completedtodo.children[1].innerText;
  completed.splice(completed.indexOf(todoIndex), 1);
  localStorage.setItem("completed", JSON.stringify(completed));
}

//Retrieve local storage
function getTodos() {
  let allday;
  if (localStorage.getItem("allday") === null) {
    allday = [];
  } else {
    allday = JSON.parse(localStorage.getItem("allday"));
  }

  let morning;
  if (localStorage.getItem("morning") === null) {
    morning = [];
  } else {
    morning = JSON.parse(localStorage.getItem("morning"));
  }

  let afternoon;
  if (localStorage.getItem("afternoon") === null) {
    afternoon = [];
  } else {
    afternoon = JSON.parse(localStorage.getItem("afternoon"));
  }

  let evening;
  if (localStorage.getItem("evening") === null) {
    evening = [];
  } else {
    evening = JSON.parse(localStorage.getItem("evening"));
  }

  let completed;
  if (localStorage.getItem("completed") === null) {
    completed = [];
  } else {
    completed = JSON.parse(localStorage.getItem("completed"));
  }

  allday.forEach(function (todo) {
    //Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("fadein");

    //Checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Create LI
    const newToDo = document.createElement("li");
    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    todoDiv.appendChild(newToDo);

    //Trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoDiv.classList.add("allday-todo");
    alldayList.appendChild(todoDiv);
  });

  morning.forEach(function (todo) {
    //Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("fadein");

    //Checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Create LI
    const newToDo = document.createElement("li");
    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    todoDiv.appendChild(newToDo);

    //Trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoDiv.classList.add("morning-todo");
    morningList.appendChild(todoDiv);
  });

  afternoon.forEach(function (todo) {
    //Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("fadein");

    //Checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Create LI
    const newToDo = document.createElement("li");
    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    todoDiv.appendChild(newToDo);

    //Trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoDiv.classList.add("afternoon-todo");
    afternoonList.appendChild(todoDiv);
  });

  evening.forEach(function (todo) {
    //Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("fadein");

    //Checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //Create LI
    const newToDo = document.createElement("li");
    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    todoDiv.appendChild(newToDo);

    //Trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoDiv.classList.add("evening-todo");
    eveningList.appendChild(todoDiv);
  });

  completed.forEach(function (todo) {
    //Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("completed");
    todoDiv.classList.remove("fadein");

    //Checkmark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    completedButton.classList.add("check-completed");
    todoDiv.appendChild(completedButton);

    //Create LI
    const newToDo = document.createElement("li");
    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    todoDiv.appendChild(newToDo);

    //Trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoDiv.classList.add("allday-todo");
    completedContainer.appendChild(todoDiv);
  });
}
