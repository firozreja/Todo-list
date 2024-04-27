// selecting element
const inputField = document.querySelector('.input_area input');
const addNewBtn = document.querySelector('.input_area button');
const todoList = document.querySelector('.todo_list');


// get input form user
function getUserInput(){
    const taskName = inputField.value;
    inputField.value="";
    return taskName;
}

// add task display UI
function displayTaskUI(taskName){
    const li = document.createElement("li")
    li.innerHTML = `<span id="taskName">${taskName}</span>
                    <button id="edit"><i class="fa-solid fa-pen"></i></button>
                    <button id="delete"><i class="fa-regular fa-trash-can"></i></button>`;

    todoList.appendChild(li);
}


// handle add task
function handleAddTask(){
    const taskName = getUserInput();
    if(!taskName) return;
    displayTaskUI(taskName);
    addTaskToLocalStorage(taskName);
}

// handle enter key event of input
function handleKeyPress(e){
    if(e.key === "Enter"){
    handleAddTask();
    }
}

// add tasks to localStorage
function addTasksToLocalStorage(tasks){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

// add task to localStorage
function addTaskToLocalStorage(taskName){
    const tasks = getTasksFromLocalStorage();
    tasks.push(taskName);
    addTasksToLocalStorage(tasks);
}

// get all task to localStorage
function getTasksFromLocalStorage(){
    let tasks = [];
    const rowTasks = localStorage.getItem('tasks');
    if(rowTasks){
        tasks = JSON.parse(rowTasks);
    }
    return tasks;
}

// display all task to UI while page loaded
function loadAndDisplayAllTasks(){
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((taskName) => displayTaskUI(taskName));
}
loadAndDisplayAllTasks();


// delete task from localStorage
function deleteTaskFromLocalStorage(taskName){
    const tasks = getTasksFromLocalStorage();
    const taskAfterDeleting = tasks.filter(task => task !== taskName)
    addTasksToLocalStorage(taskAfterDeleting);
}

// delete list handler
function deleteListHandler(targetEl){
    const li = targetEl.parentElement;
    const taskName = li.querySelector("#taskName").textContent;
    li.remove();
    deleteTaskFromLocalStorage(taskName);
}


// update task to localStorage
function updateTaskToLocalStorage(newTaskName,preVal){
    const tasks = getTasksFromLocalStorage();
    const taskAfterUpdate = tasks.map(taskName =>{
        if(taskName === preVal){
            return newTaskName;
        }else{
            return taskName;
        }
    })
    addTasksToLocalStorage(taskAfterUpdate);
}

// update task
function updateTask(input,preVal){
    const newTaskName = input.value;
    const li = input.parentElement;
    li.innerHTML = `<span id="taskName">${newTaskName}</span>
                    <button id="edit"><i class="fa-solid fa-pen"></i></button>
                    <button id="delete"><i class="fa-regular fa-trash-can"></i></button>`;

    updateTaskToLocalStorage(newTaskName,preVal)
}


// input and update handler
function eventHandler(e,preVal){
    const input = e.target;
    if(e.key === "Enter"){
        updateTask(input,preVal)
    }
    
}

function updateHandler(e,preVal){
    const input =e.target.previousElementSibling;
    updateTask(input,preVal)
}

// edit handler
function editHandler(targetEl){
    const li = targetEl.parentElement;
    const preVal = li.querySelector("#taskName").textContent;
    li.innerHTML= `<input id="input" onkeypress='eventHandler(event,"${preVal}")' value="${preVal}">
                   <button id="button" onclick = 'updateHandler(event,"${preVal}")'>Update</button>`


}

//  edite and delete actionHandler
function actionHandler(e){
    const targetEl = e.target;
    if(targetEl.id === "delete"){
        deleteListHandler(targetEl);
    }else if(targetEl.id === "edit"){
        editHandler(targetEl);
    }
}


// handling events
inputField.addEventListener('keypress',handleKeyPress);
addNewBtn.addEventListener('click',handleAddTask);
todoList.addEventListener('click',actionHandler)

