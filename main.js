const notesContainer = document.getElementById("app");
const addNoteButton = document.getElementById("add");

var canvas;
var ctx;
var lastPt = new Object();
var colours = ['red', 'green', 'blue', 'yellow', 'black'];

function init() {
  var touchzone = document.getElementById("message");
  touchzone.addEventListener("touchmove", draw, false);
  touchzone.addEventListener("touchend", end, false);
  canvas = document.getElementById('message');
  ctx = canvas.getContext("2d");
}

function draw(e) {
  e.preventDefault();

  //Iterate over all touches
  for(var i=0;i<e.touches.length;i++) {
    var id = e.touches[i].identifier;
    if(lastPt[id]) {
      ctx.beginPath();
      ctx.moveTo(lastPt[id].x, lastPt[id].y);
      ctx.lineTo(e.touches[i].pageX, e.touches[i].pageY);
      ctx.strokeStyle = colours[id];
      ctx.stroke();

    }
    // Store last point
    lastPt[id] = {x:e.touches[i].pageX, y:e.touches[i].pageY};
  }
}

function end(e) {
e.preventDefault();
for(var i=0;i<e.changedTouches.length;i++) {
  var id = e.changedTouches[i].identifier;
  // Terminate this touch
  delete lastPt[id];
}
}

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
  textArea.addEventListener("load", init);

  const deleteButton = document.createElement("BUTTON-del");
  deleteButton.classList.add("delete-note");
  deleteButton.innerHTML = `<p><span>Delete Note</span></p>`



  const clearButton = document.createElement("BUTTON-clr");
  clearButton.classList.add("clear-note");
  clearButton.innerHTML = `<p><span>Reset Note</span></p>`

  element.appendChild(textArea);
  element.appendChild(deleteButton);
  element.appendChild(clearButton);

  document.body.appendChild(element);

  textArea.addEventListener("change", () => {
    updateNote(id, textArea.value);
  });

  deleteButton.addEventListener("click", () => {
    const doDelete = confirm(
      "Do you want delete this note?"
    );

    if (doDelete) {
      const notes = getNotes().filter((note) => note.id != id);

      saveNotes(notes);
      element.removeChild(textArea);
      element.removeChild(clearButton);
      element.removeChild(deleteButton);
    }
  });

  clearButton.addEventListener("click", function() {
    const doReset = confirm(
      "Do you want clear this note?"
    );

    if (doReset) {
      textArea.value = '';
    }
  });
  return element;
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
