const notesContainer = document.getElementById("app");
const addNoteButton = document.getElementById("add");

getNotes().forEach((note) => {
  const noteElement = createNoteElement(note.id, note.content);
  notesContainer.insertBefore(noteElement, null);
});

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
  return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
  localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
  const element = document.createElement("element");

  const textArea = document.createElement("textarea");
  textArea.classList.add("note");
  textArea.value = content;
  textArea.placeholder = "Empty Sticky Note";

  const deleteButton = document.createElement("BUTTON-del");
  deleteButton.classList.add("delete-note-n");
  deleteButton.innerHTML = `<p><span>Delete Note</span></p>`

  const clearButton = document.createElement("BUTTON-clr");
  clearButton.classList.add("clear-note-n");
  clearButton.innerHTML = `<p><span>Reset Note</span></p>`

  element.appendChild(textArea);
  element.appendChild(deleteButton);
  element.appendChild(clearButton);

  document.body.appendChild(element);

  textArea.addEventListener("change", () => {
    updateNote(id, textArea.value);
  });


  deleteNote(element,textArea,deleteButton,clearButton)

  clearNote(clearButton,textArea)
  return element;
}

function deleteNote(element,textArea,deleteButton,clearButton) {
  deleteButton.addEventListener("click", () => {
    const doDelete = confirm(
      "Do you want delete this note?"
    );

    if (doDelete) {
      deleteButton.classList.add("delete-note");
      const notes = getNotes().filter((note) => note.id != id);

      saveNotes(notes);
      element.removeChild(textArea);
      element.removeChild(clearButton);
      element.removeChild(deleteButton);
    }else{
      deleteButton.classList.remove("delete-note");
      deleteButton.classList.add("delete-note-n");
    }
  });
}

function clearNote(clearButton,textArea) {
clearButton.addEventListener("click", function() {
  const doReset = confirm(
    "Do you want clear this note?"
  );

  if (doReset) {
    clearButton.classList.add("clear-note");
    textArea.value = '';
  }else{
    clearButton.classList.remove("clear-note");
    clearButton.classList.add("clear-note-n");
  }
});
}

function addNote() {
  const notes = getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 100000),
    content: ""
  };

  const noteElement = createNoteElement(noteObject.id, noteObject.content);
  notesContainer.insertBefore(noteElement, null);

  notes.push(noteObject);
  saveNotes(notes);
}

function updateNote(id, newContent) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id == id)[0];

  targetNote.content = newContent;
  saveNotes(notes);
}

function deleteAll() {
  const doDeleteAll = confirm(
    "Do you want to delete all your notes?"
  );

  if (doDeleteAll) {
    localStorage.clear();
    location.reload();
  }
}

function clearAll() {
  const doClearAll = confirm(
    "Do you want to clear all your notes?"
  );

  if (doClearAll) {
    const notes = getNotes();
    notes.forEach((note) => {
      console.log(note.content);
      note.content = ' ';
      saveNotes(notes);
      location.reload();
    });
  }
}
