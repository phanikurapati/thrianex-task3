const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

renderTodos();

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();

    if (!text) return;

    const todo = {
        id: Date.now(),
        text,
        completed: false
    };

    todos.push(todo);

    saveTodos();
    renderTodos();

    todoInput.value = "";
});

todoList.addEventListener("click", (e) => {
    const item = e.target.closest(".todo-item");

    if (!item) return;

    const id = Number(item.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        deleteTodo(id);
    }

    if (e.target.classList.contains("complete-btn")) {
        toggleComplete(id);
    }

    if (e.target.classList.contains("edit-btn")) {
        editTodo(id);
    }
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        renderTodos();
    });
});

function renderTodos() {
    todoList.innerHTML = "";

    let filteredTodos = todos;

    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");

        li.className = `todo-item ${todo.completed ? "completed" : ""}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <span>${todo.text}</span>

            <div class="actions">
                <button class="complete-btn">
                    ${todo.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);

    saveTodos();
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo =>
        todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
    );

    saveTodos();
    renderTodos();
}

function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);

    const newText = prompt("Edit Task:", todo.text);

    if (newText === null) return;

    todo.text = newText.trim() || todo.text;

    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}
