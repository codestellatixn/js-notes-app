
const addBtn = document.getElementById("add");

const notes = JSON.parse(localStorage.getItem("notes")) || [];

if (notes.length > 0) {
  notes.forEach((note) => {
    addNewNote(note);
  });
}

addBtn.addEventListener("click", () => {
  addNewNote();
});

//debounce
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const debounceUpdateLS = debounce(updateLS, 300);

function addNewNote(text = "") {
  const note = document.createElement("div");
  note.classList.add("note");

  note.innerHTML = `
        <div class="notes">

            <div class="tools">
                <button class="edit">
                <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button class="delete">
                <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
      
            <div class="main ${text ? "" : "hidden"}"></div>
            <textarea class="${text ? "hidden" : ""}"></textarea>
        </div>
    `;

  const editBtn = note.querySelector(".edit");
  const deleteBtn = note.querySelector(".delete");

  const main = note.querySelector(".main");
  const textArea = note.querySelector("textarea");

  textArea.value = text;
  main.innerHTML = marked.parse(text);

  editBtn.addEventListener("click", () => {
    main.classList.toggle("hidden");
    textArea.classList.toggle("hidden");

    if (textArea.classList.contains("hidden")) {
      editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      textArea.style.backgroundColor = "var(--yellow-color";
    } else {
      editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      textArea.style.backgroundColor = "#FFE9D3";
    }
  });

  deleteBtn.addEventListener("click", () => {
    note.remove();

    debounceUpdateLS();
  });

  textArea.addEventListener("input", (e) => {
    let {value} = e.target;

    main.innerHTML = marked.parse(value);

    debounceUpdateLS();
  });

  document.body.appendChild(note);
}

function updateLS() {
  const notesText = document.querySelectorAll("textarea");

  const notes = [];

  notesText.forEach((note) => {
    notes.push(note.value);
  });

  localStorage.setItem("notes", JSON.stringify(notes));
}
