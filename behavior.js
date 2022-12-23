const crimson = 'rgb(220, 20, 60)';
const forestgreen = 'rgb(34, 139, 34)';

let defaultColor = crimson;

let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', handleRowCreation);

let rowTextInputBox = document.getElementById('inputBox');
rowTextInputBox.addEventListener('keydown', createRowOnKeydown);

function handleDrop(event) {
  event.preventDefault();
  console.log('dropped');
  console.log(`event target: ${event.target}`);
  console.log(
    `event.dataTransfer.data: ${event.dataTransfer.getData(
      'application/x-moz-node'
    )}`
  );
  let tableList = document.getElementById('tableList');
  console.log(`tableList Element: ${tableList}`);
  console.log(`tableList class: ${tableList.classList}`);
  console.log(`event.target class: ${event.target.classList}`);

  if (event.target.classList == 'tableList') {
    let draggedRowData = event.dataTransfer.getData('application/x-moz-node');
    console.log(`draggedRowData: ${draggedRowData}`);
    let draggedRow = document.createElement('tr');
    draggedRow.innerHTML = draggedRowData;
    draggedRow.classList = 'tableListRow';
    console.log(`draggedRow.innerHTML: ${draggedRow.innerHTML}`);
    addBehaviorToRowChildren(draggedRow);
    console.log(draggedRow);

    tableList.appendChild(draggedRow);
  }
}

function handleDragStart(event) {
  console.log(
    `Is ${event.target.parentNode} a Node: ${
      event.target.parentNode instanceof Node
    }`
  );
  console.log(event.target.parentNode);
  event.dataTransfer.setData(
    'application/x-moz-node',
    event.target.parentNode.innerHTML
  );
  event.dataTransfer.setDragImage(event.target.parentNode, 0, 0);
}

function handleTextSubstitution(event) {
  let currentText = event.target.textContent;
  let currentTableListRowDescriptor = event.target;

  let inputSubtitutor = document.createElement('input');
  inputSubtitutor.value = currentText;
  inputSubtitutor.classList = 'tableListRowDescriptorSubstitution';
  inputSubtitutor.addEventListener('keydown', substituteBackOnKeydown);
  inputSubtitutor.addEventListener('blur', substituteBackOnBlur);
  inputSubtitutor.addEventListener('keydown', handleRowDeletion);
  inputSubtitutor.addEventListener('blur', handleRowDeletion);

  let parentTableListRow = currentTableListRowDescriptor.parentNode;
  parentTableListRow.replaceChild(
    inputSubtitutor,
    currentTableListRowDescriptor
  );
}

function handleRowDeletion(event) {
  let tableListRowSubstitutorContent = event.target.value;

  if (event.key == 'Enter' && tableListRowSubstitutorContent == '') {
    event.target.removeEventListener('blur', handleRowDeletion);

    let tableListRow = event.target.parentNode;
    let tableList = event.target.parentNode.parentNode;

    tableList.removeChild(tableListRow);

    if (tableList.childNodes.length == 0) {
      tableList.parentNode.removeChild(tableList);
    }
  } else if (event.key == 'Escape' && tableListRowSubstitutorContent == '') {
    event.target.removeEventListener('blur', handleRowDeletion);

    let tableListRow = event.target.parentNode;
    let tableList = event.target.parentNode.parentNode;

    tableList.removeChild(tableListRow);

    if (tableList.childNodes.length == 0) {
      tableList.parentNode.removeChild(tableList);
    }
  } else if (event.type == 'blur' && tableListRowSubstitutorContent == '') {
    let tableListRow = event.target.parentNode;
    let tableList = event.target.parentNode.parentNode;

    tableList.removeChild(tableListRow);

    if (tableList.childNodes.length == 0) {
      tableList.parentNode.removeChild(tableList);
    }
  }
}

function substituteBackOnBlur(event) {
  if (event.target.value != '') {
    let newTableListRowDescriptor = document.createElement('td');
    newTableListRowDescriptor.classList = 'tableListRowDescriptor';
    newTableListRowDescriptor.textContent = event.target.value;
    newTableListRowDescriptor.addEventListener(
      'dblclick',
      handleTextSubstitution
    );

    let parentTableListRow = event.target.parentNode;
    parentTableListRow.replaceChild(newTableListRowDescriptor, event.target);
  }
}

function substituteBackOnKeydown(event) {
  let inputSubtitutorValue = event.target.value;

  if (event.key == 'Enter' && inputSubtitutorValue != '') {
    let newTableListRowDescriptor = document.createElement('td');
    newTableListRowDescriptor.classList = 'tableListRowDescriptor';
    newTableListRowDescriptor.textContent = event.target.value;
    newTableListRowDescriptor.addEventListener(
      'dblclick',
      handleTextSubstitution
    );

    event.target.removeEventListener('blur', substituteBackOnBlur);

    let parentTableListRow = event.target.parentNode;
    parentTableListRow.replaceChild(newTableListRowDescriptor, event.target);
  } else if (event.key == 'Escape' && inputSubtitutorValue != '') {
    let newTableListRowDescriptor = document.createElement('td');
    newTableListRowDescriptor.classList = 'tableListRowDescriptor';
    newTableListRowDescriptor.textContent = event.target.value;
    newTableListRowDescriptor.addEventListener(
      'dblclick',
      handleTextSubstitution
    );

    event.target.removeEventListener('blur', substituteBackOnBlur);

    let parentTableListRow = event.target.parentNode;
    parentTableListRow.replaceChild(newTableListRowDescriptor, event.target);
  }
}

function createRowOnKeydown(event) {
  if (event.key == 'Enter') {
    handleRowCreation();
  }
}

function handleIndicatorClick(event) {
  let tableListRowIndicator = event.target;

  if (tableListRowIndicator.style.backgroundColor == crimson) {
    tableListRowIndicator.style.backgroundColor = forestgreen;
  } else if (tableListRowIndicator.style.backgroundColor == forestgreen) {
    tableListRowIndicator.style.backgroundColor = crimson;
  }
}

function addBehaviorToRowChildren(HTMLTableListRow) {
  console.log(HTMLTableListRow.childNodes);

  let rowColumns = HTMLTableListRow.childNodes;

  for (let i = 0; i < rowColumns.length; i++) {
    if (rowColumns[i].classList == 'tableListRowIndicator') {
      rowColumns[i].addEventListener('click', handleIndicatorClick);
      rowColumns[i].draggable = true;
      rowColumns[i].addEventListener('dragstart', handleDragStart);
    } else if (rowColumns[i].classList == 'tableListRowDescriptor') {
      rowColumns[i].addEventListener('dblclick', handleTextSubstitution);
    }
  }
}

function initTableListRow() {
  let listRowIndicator = document.createElement('td');
  listRowIndicator.classList.add('tableListRowIndicator');
  listRowIndicator.style.backgroundColor = defaultColor;

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('tableListRowDescriptor');
  listRowDescriptor.textContent = document.getElementById('inputBox').value;

  let newListRow = document.createElement('tr');
  newListRow.classList.add('tableListRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);

  addBehaviorToRowChildren(newListRow);

  return newListRow;
}

function handleRowCreation() {
  let list;

  if (document.getElementById('tableList') == undefined) {
    list = document.createElement('table');
    list.id = 'tableList';
    list.classList = 'tableList';
    list.addEventListener('dragenter', (event) => {
      event.preventDefault();
      console.log('entering drag area');
      console.log(`event target: ${event.target}`);
      event.dataTransfer.dropEffect = 'move';
    });
    list.addEventListener('dragover', (event) => {
      event.preventDefault();
      console.log('entering drag area again');
      console.log(`event.dataTransfer.types: ${event.dataTransfer.types}`);
      event.dataTransfer.dropEffect = 'move';
    });
    list.addEventListener('drop', handleDrop);

    let listArea = document.getElementsByClassName('list')[0];
    listArea.appendChild(list);
  } else {
    list = document.getElementById('tableList');
  }

  let newListRow = initTableListRow();

  list.appendChild(newListRow);
}
