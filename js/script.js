let items = JSON.parse(localStorage.getItem('items')) || [];

const itemForm = document.getElementById('itemForm');
const itemInput = document.getElementById('itemInput');
const itemList = document.getElementById('itemList');
const filterInput = document.getElementById('filter');
const clearBtn = document.getElementById('clear');

const submitBtn = itemForm.querySelector('button');

let editMode = false;
let editIndex = null;

/*Render*/
const renderItems = (list = items) => {
  itemList.innerHTML = '';

  list.forEach((item, index) => {
    itemList.innerHTML += `
      <li class="items-li" data-index="${index}">
        <span>${item}</span>
        <button class="btn-delete-item" type="button">❌</button>
      </li>
    `;
  });
};

/*LocalStorage*/
const saveItems = () => {
  localStorage.setItem('items', JSON.stringify(items))
};

/*Add & Update Item*/
itemForm.addEventListener('submit', e => {
  e.preventDefault();
  const newItem = itemInput.value.trim();
  if (!newItem) return;

  //No repetidos
  if (!editMode && items.includes(newItem)) {
    alert ('Este item ya existe');
    return;
  }

  if (editMode) {
    items[editIndex] = newItem;
    editMode = false;
    editIndex = null;
    submitBtn.textContent = '+ Add item';
  } else {
    items.push(newItem);
  }

  itemForm.reset();
  saveItems();
  renderItems();
});

/*Delete Item*/
const deleteItem = index => {
  const confirmDelete = confirm('¿Seguro que deseas borrar este item?');
  if (!confirmDelete) return;

  items.splice(index, 1);
  saveItems();
  renderItems();
};

/*Clear All*/
clearBtn.addEventListener('click', () => {
  const confirmClear = confirm('¿Seguro que deseas borrar TODA la lista?');
  if (!confirmClear) return;

  items = [];
  saveItems();
  renderItems();
});

/*Filter*/
filterInput.addEventListener('input', e => {
  const text = e.target.value.toLowerCase();

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(text)
  );

  renderItems(filteredItems);
});

/*Btn Edit*/
const editItem = index => {
  itemInput.value = items[index];
  editMode = true;
  editIndex = index;
  submitBtn.textContent = '✍️ Update item';
}


itemList.addEventListener('click', e => {
  const li = e.target.closest('.items-li');
  if (!li) return;

  const index = li.dataset.index;

  // Delete
  if (e.target.classList.contains('btn-delete-item')) {
    const confirmDelete = confirm('¿Seguro que deseas borrar este item?');
    if (!confirmDelete) return;

    deleteItem(index);
    return;
  }

  // Edit
  editItem(index);
});

renderItems();
