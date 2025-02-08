const serverURL = "http://localhost:1229/api";

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${serverURL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Your email or password is incorrect...");
        }
        
        localStorage.setItem("token", data.token);
        window.location.href = "notes.html";
    } catch (error) {
        alert(error.message);
    }
}

async function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!email.includes("@") || !email.includes(".")) {
        alert("Invalid email address");
        return;
    }
    if (password.length < 6 || password.length > 20 || password !== confirmPassword) {
        alert("Password must be 6-20 characters and match");
        return;
    }

    const response = await fetch(`${serverURL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (response.ok) {
        window.location.href = "notes.html";
    }
}

async function addNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(`${serverURL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, content })
        });
        
        if (!response.ok) {
            throw new Error("Failed to add note");
        }
        
        loadNotes(); // Ensure notes update after adding a new one
    } catch (error) {
        alert(error.message);
    }
}

function toggleEditSection(noteId, currentTitle, currentContent) {
    let editSection = document.getElementById(`edit-section-${noteId}`);
    
    if (editSection) {
        editSection.classList.toggle("hidden");
    } else {
        const noteElement = document.getElementById(`note-${noteId}`);
        editSection = document.createElement("div");
        editSection.id = `edit-section-${noteId}`;
        editSection.classList.add("edit-section");
        editSection.innerHTML = `
            <input type="text" id="edit-title-${noteId}" value="${currentTitle}" required>
            <textarea id="edit-content-${noteId}">${currentContent}</textarea>
            <button onclick="saveEdit('${noteId}')">Save</button>
        `;
        noteElement.appendChild(editSection);
    }
}

async function saveEdit(noteId) {
    const newTitle = document.getElementById(`edit-title-${noteId}`).value;
    const newContent = document.getElementById(`edit-content-${noteId}`).value;
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(`${serverURL}/notes/${noteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });
        
        if (!response.ok) {
            throw new Error("Failed to edit note");
        }
        
        loadNotes(); // Refresh the notes after editing
    } catch (error) {
        alert(error.message);
    }
}

async function loadNotes() {
    const token = localStorage.getItem("token");
    const notesDisplay = document.getElementById("notes-display");
    notesDisplay.innerHTML = "<p>Loading notes...</p>";
    
    try {
        const response = await fetch(`${serverURL}/notes`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch notes");
        }
        
        const notes = await response.json();
        notesDisplay.innerHTML = "";
        
        if (notes.length === 0) {
            notesDisplay.innerHTML = "<p>Write down something to add your first note !</p>";
        } else {
            notes.forEach(note => {
                const noteElement = document.createElement("div");
                noteElement.classList.add("note-item");
                noteElement.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    <button onclick="editNote('${note._id}', '${note.title}', '${note.content}')">Edit</button>
                    <button style="background-color: red; color: white;" onclick="deleteNote('${note._id}')">Delete</button>
                `;
                notesDisplay.appendChild(noteElement);
            });
        }
    } catch (error) {
        notesDisplay.innerHTML = `<p>Error loading notes: ${error.message}</p>`;
    }
}

async function deleteNote(noteId) {
    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }
    
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(`${serverURL}/notes/${noteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error("Failed to delete note");
        }
        
        loadNotes(); // Refresh the notes after deletion
    } catch (error) {
        alert(error.message);
    }
}

async function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("notes.html")) {
        loadNotes();
    }
});
