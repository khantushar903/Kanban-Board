let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;

const tasks = document.querySelectorAll(".task");


function updateCounts() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right-count");
        count.innerText = tasks.length;
    });
}

function saveToLocalStorage() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll(".task");

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            };
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function enableDrag(task) {
    task.addEventListener("drag", () => {
        dragElement = task;
    });
}

function createTaskElement(title, desc) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    enableDrag(div); 

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () =>{
        div.remove();
        updateCounts();
        saveToLocalStorage();
    })

    return div;
}


if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const coloum = document.querySelector(`#${col}`);

        data[col].forEach(task => {
            const div = createTaskElement(task.title, task.desc);
            coloum.appendChild(div);

            enableDrag(div);
        });
    }
}


tasks.forEach(task => enableDrag(task));


function adddragEventsOnColoum(coloum) {

    coloum.addEventListener("dragenter", (e) => {
        e.preventDefault();
        coloum.classList.add("hover-over");
    });

    coloum.addEventListener("dragleave", (e) => {
        e.preventDefault();
        coloum.classList.remove("hover-over");
    });

    coloum.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    coloum.addEventListener("drop", (e) => {
        e.preventDefault();

        coloum.appendChild(dragElement);
        coloum.classList.remove("hover-over");

        updateCounts();
        saveToLocalStorage();
    });
}

adddragEventsOnColoum(todo);
adddragEventsOnColoum(progress);
adddragEventsOnColoum(done);

updateCounts();

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".bg");
const modal = document.querySelector(".modal");

const addNewTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addNewTaskButton.addEventListener("click", () => {

    const title = document.querySelector("#task-title-input").value;
    const desc = document.querySelector("#task-des-input").value;

    const div = createTaskElement(title, desc);
    todo.appendChild(div);

    modal.classList.remove("active");

    enableDrag(div);      
    updateCounts();       
    saveToLocalStorage(); 

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-des-input").value = "";

});
