const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogListElement = document.getElementById('backlog-list');
const progressListElement = document.getElementById('progress-list');
const completeListElement = document.getElementById('complete-list');
const onHoldListElement = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
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
    progressListArray = ['Coding Functionality', 'Reading Pelosi Book'];
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

// Create DOM Elements for each list item
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

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
const updateDOM = () => {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumnsFromLocalStorageOrSetDefault();
  // Backlog Column
  backlogListElement.textContent = '';
  backlogListArray.forEach((backlogItem, index) => createItemElements(backlogListElement, 0, backlogItem, index));
  backlogListArray = removeEmptyValues(backlogListArray);
  // Progress Column
  progressListElement.textContent = '';
  progressListArray.forEach((progressItem, index) => createItemElements(progressListElement, 1, progressItem, index));
  progressListArray = removeEmptyValues(progressListArray);
  // Complete Column
  completeListElement.textContent = '';
  completeListArray.forEach((completeItem, index) => createItemElements(completeListElement, 2, completeItem, index));
  completeListArray = removeEmptyValues(completeListArray);
  // On Hold Column
  onHoldListElement.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => createItemElements(onHoldListElement, 3, onHoldItem, index));
  onHoldListArray = removeEmptyValues(onHoldListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumnsInLocalStorage();
};

// Update Item - Delete if necessary, or update Array value
const updateItem = (id, column) => {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    !selectedColumn[id].textContent ? delete selectedArray[id] : (selectedArray[id] = selectedColumn[id].textContent);
    updateDOM();
  }
};

// Add to Column List, Reset Textbox
const addToColumn = (column) => {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM(column);
};

// Show Add Item Input Box
const showInputBox = (column) => {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
};

// Hide Item Input Box
const hideInputBox = (column) => {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
};

// Allows arrays to reflect Drag and Drop items
const rebuildArrays = () => {
  backlogListArray = Array.from(backlogListElement.children).map((i) => i.textContent);
  progressListArray = Array.from(progressListElement.children).map((i) => i.textContent);
  completeListArray = Array.from(completeListElement.children).map((i) => i.textContent);
  onHoldListArray = Array.from(onHoldListElement.children).map((i) => i.textContent);
  updateDOM();
};

// When Item Enters Column Area
const dragEnter = (column) => {
  listColumns[column].classList.add('over');
  currentColumn = column;
};

// When Item Starts Dragging
const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

// Column Allows for Item to Drop
const allowDrop = (e) => e.preventDefault();

// Dropping Item in Column
const drop = (e) => {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  listColumns.forEach((column) => column.classList.remove('over'));
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
};

// On Load
updateDOM();
