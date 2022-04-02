const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach((note) => {
  const noteElement = createNoteElement(note.id, note.content);
  notesContainer.insertBefore(noteElement, addNoteButton);
});


addNoteButton.addEventListener("click", () => addNote());


function getNotes() {
  return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}


function saveNotes(notes) {
  localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}


function createNoteElement(id, content) {
  const elmnt = document.getElementById("board");
  const cln = elmnt.cloneNode(true);
  cln.message.value = content;
  cln.message.placeholder = "Empty Sticky Note";
  document.body.appendChild(cln);

  cln.addEventListener("change", () => {
    updateNote(id, cln.message.value);
  });

  cln.delete.addEventListener("click", function() {
    const doDelete = confirm(
      "Are you sure you wish to delete this sticky note?"
    );

    if (doDelete) {
      deleteNote(id, cln);
    }
  });

  cln.clear.addEventListener("click", function() {
    const doReset = confirm(
      "Are you sure you want to reset all text?"
    );

    if (doReset) {
      updateNote(id, '');
    }
  });

  return cln;
}


function addNote() {
  const notes = getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 100000),
    content: ""
  };

  const noteElement = createNoteElement(noteObject.id, noteObject.content);
  notesContainer.insertBefore(noteElement, addNoteButton);

  notes.push(noteObject);
  saveNotes(notes);
}


function updateNote(id, newContent) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id == id)[0];

  targetNote.content = newContent;
  saveNotes(notes);
}


function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id != id);

  saveNotes(notes);
  notesContainer.removeChild(element);
}
