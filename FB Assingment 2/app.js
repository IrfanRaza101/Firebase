import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDf4PvRAtIVyAu7pRmuYF2usuYrDmoc7Cc",
    authDomain: "full-security-94add.firebaseapp.com",
    projectId: "full-security-94add",
    storageBucket: "full-security-94add.appspot.com",
    messagingSenderId: "534326451625",
    appId: "1:534326451625:web:49b6e6d3259aa7f45b38b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase Setup Done", app);

const addTodo = document.getElementById("addTODO");
const todoList = document.getElementById("todos");
const inputField = document.getElementById("input_field");

addTodo.addEventListener("click", addTodoHandler);

async function addTodoHandler() {
    try {
        const inputText = inputField.value.trim();
        if (!inputText) {
            alert("Please enter a valid task!");
            return;
        }

        const docRef = await addDoc(collection(db, "todos"), { task: inputText });

        console.log("Task added with ID:", docRef.id);
        inputField.value = ""; 
        getTodos();
    } catch (e) {
        console.error("Error adding document:", e);
    }
}

async function getTodos() {
    try {
        todoList.innerHTML = "";
        const todos = await getDocs(collection(db, "todos"));

        todos.forEach((docSnap) => {
            const { task } = docSnap.data();
            const li = document.createElement("li");
            li.setAttribute("data-id", docSnap.id);
            li.innerHTML = `
                <div class="item">
                <span>${task}</span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                </div>
            `;

            todoList.appendChild(li);

            li.querySelector(".edit-btn").addEventListener("click", () => updateTodo(docSnap.id));
            li.querySelector(".delete-btn").addEventListener("click", () => deleteTodo(docSnap.id));
        });

    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}

async function updateTodo(id) {
    const newTask = inputField.value.trim();
    if (!newTask) {
        alert("Please enter the updated task in the input field!");
        return;
    }

    try {
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, { task: newTask });

        console.log("Task updated:", id);
        inputField.value = "";
        getTodos();
    } catch (error) {
        console.error("Error updating document:", error);
    }
}

async function deleteTodo(id) {
    try {
        await deleteDoc(doc(db, "todos", id));
        console.log("Task deleted:", id);
        getTodos();
    } catch (error) {
        console.error("Error deleting document:", error);
    }
}

getTodos();
