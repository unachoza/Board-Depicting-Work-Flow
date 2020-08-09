const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogListElement = document.getElementById('backlog-list');
const progressListElement = document.getElementById('progress-list');
const completeListElement = document.getElementById('complete-list');
const onHoldListElement = document.getElementById('on-hold-list');

let updatedOnLoad = false;

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let draggedItem;
let dragging = false;
let currentColumn;

const getSavedColumnsFromLocalStorageOrSetDefault = () => {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Run 10K', 'Hem pants'];
    progressListArray = ['Code Functionality', 'Read AI Book'];
    completeListArray = ['Outline', 'Navigation'];
    onHoldListArray = ['Dinner Plans'];
  }
};

const updateSavedColumnsInLocalStorage = () => {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
};

const removeEmptyValues = (array) => (filteredArray = array.filter((item) => item !== null));

const createItemElements = (columnElement, column, item, index) => {
  const listElement = document.createElement('li');
  listElement.textContent = item;
  listElement.id = index;
  listElement.classList.add('drag-item');
  listElement.draggable = true;
  listElement.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listElement.setAttribute('ondragstart', 'drag(event)');
  listElement.contentEditable = true;
  columnElement.appendChild(listElement);
};

const updateDOM = () => {
  if (!updatedOnLoad) getSavedColumnsFromLocalStorageOrSetDefault();
  backlogListElement.textContent = '';
  backlogListArray.forEach((backlogItem, index) => createItemElements(backlogListElement, 0, backlogItem, index));
  backlogListArray = removeEmptyValues(backlogListArray);
  progressListElement.textContent = '';
  progressListArray.forEach((progressItem, index) => createItemElements(progressListElement, 1, progressItem, index));
  progressListArray = removeEmptyValues(progressListArray);
  completeListElement.textContent = '';
  completeListArray.forEach((completeItem, index) => createItemElements(completeListElement, 2, completeItem, index));
  completeListArray = removeEmptyValues(completeListArray);
  onHoldListElement.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => createItemElements(onHoldListElement, 3, onHoldItem, index));
  onHoldListArray = removeEmptyValues(onHoldListArray);
  updatedOnLoad = true;
  updateSavedColumnsInLocalStorage();
};

const updateItem = (id, column) => {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    !selectedColumn[id].textContent ? delete selectedArray[id] : (selectedArray[id] = selectedColumn[id].textContent);
    updateDOM();
  }
};

const addToColumn = (column) => {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM(column);
};

const showInputBox = (column) => {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
};

const hideInputBox = (column) => {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
};

const rebuildArrays = () => {
  backlogListArray = Array.from(backlogListElement.children).map((i) => i.textContent);
  progressListArray = Array.from(progressListElement.children).map((i) => i.textContent);
  completeListArray = Array.from(completeListElement.children).map((i) => i.textContent);
  onHoldListArray = Array.from(onHoldListElement.children).map((i) => i.textContent);
  updateDOM();
};

const dragEnter = (column) => {
  listColumns[column].classList.add('over');
  currentColumn = column;
};

const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

const allowDrop = (e) => e.preventDefault();

const drop = (e) => {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  listColumns.forEach((column) => column.classList.remove('over'));
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
};

updateDOM();
