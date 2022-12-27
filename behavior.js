const crimson = 'rgb(220, 20, 60)';
const forestgreen = 'rgb(34, 139, 34)';

let defaultColor = crimson;

let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', handleRowCreation);

let rowTextInputBox = document.getElementById('inputBox');
rowTextInputBox.addEventListener('keydown', createRowOnKeydown);

function handleClick(event) {
  let clickedRow = event.target;

  console.log(`ID of ${clickedRow}: ${clickedRow.id}`);
  console.log(`Content of ${clickedRow}: ${clickedRow.textContent}`);
}

function handleDrop(event) {
  event.preventDefault();
  console.log('dropped');
  console.log(`event target: ${event.target}`);
  console.log(
    `event.dataTransfer.data: ${event.dataTransfer.getData(
      'application/x-moz-node'
    )}`
  );

  if (
    event.target.classList == 'list' ||
    event.target.classList == 'listBody'
  ) {
    let list = document.getElementById('list');

    let draggedRowData = event.dataTransfer.getData('application/x-moz-node');
    console.log(`draggedRowData: ${draggedRowData}`);
    let draggedRow = list.insertRow(-1);

    draggedRow.innerHTML = draggedRowData;
    draggedRow.classList = 'listRow';
    console.log(`draggedRow.innerHTML: ${draggedRow.innerHTML}`);
    addBehaviorToRowChildren(draggedRow);
    console.log(draggedRow);
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
  let currentListRowDescriptor = event.target;

  let inputSubtitutor = document.createElement('input');
  inputSubtitutor.value = currentText;
  inputSubtitutor.classList = 'listRowDescriptorSubstitution';
  inputSubtitutor.addEventListener('keydown', substituteBackOnKeydown);
  inputSubtitutor.addEventListener('blur', substituteBackOnBlur);
  inputSubtitutor.addEventListener('keydown', handleRowDeletion);
  inputSubtitutor.addEventListener('blur', handleRowDeletion);

  let parentListRow = currentListRowDescriptor.parentNode;
  parentListRow.replaceChild(inputSubtitutor, currentListRowDescriptor);
}

function handleRowDeletion(event) {
  let listRowSubstitutorContent = event.target.value;

  if (event.key == 'Enter' && listRowSubstitutorContent == '') {
    event.target.removeEventListener('blur', handleRowDeletion);

    let listRow = event.target.parentNode;
    let list = event.target.parentNode.parentNode;

    list.removeChild(listRow);

    if (list.childNodes.length == 0) {
      list.parentNode.removeChild(list);
    }
  } else if (event.key == 'Escape' && listRowSubstitutorContent == '') {
    event.target.removeEventListener('blur', handleRowDeletion);

    let listRow = event.target.parentNode;
    let list = event.target.parentNode.parentNode;

    list.removeChild(listRow);

    if (list.childNodes.length == 0) {
      list.parentNode.removeChild(list);
    }
  } else if (event.type == 'blur' && listRowSubstitutorContent == '') {
    let listRow = event.target.parentNode;
    let list = event.target.parentNode.parentNode;

    list.removeChild(listRow);

    if (list.childNodes.length == 0) {
      list.parentNode.removeChild(list);
    }
  }
}

function substituteBackOnBlur(event) {
  if (event.target.value != '') {
    let newListRowDescriptor = document.createElement('td');
    newListRowDescriptor.classList = 'listRowDescriptor';
    newListRowDescriptor.textContent = event.target.value;
    newListRowDescriptor.addEventListener('dblclick', handleTextSubstitution);

    let parentListRow = event.target.parentNode;
    parentListRow.replaceChild(newListRowDescriptor, event.target);
  }
}

function substituteBackOnKeydown(event) {
  let inputSubtitutorValue = event.target.value;

  if (event.key == 'Enter' && inputSubtitutorValue != '') {
    let newListRowDescriptor = document.createElement('td');
    newListRowDescriptor.classList = 'listRowDescriptor';
    newListRowDescriptor.textContent = event.target.value;
    newListRowDescriptor.addEventListener('dblclick', handleTextSubstitution);

    event.target.removeEventListener('blur', substituteBackOnBlur);

    let parentListRow = event.target.parentNode;
    parentListRow.replaceChild(newListRowDescriptor, event.target);
  } else if (event.key == 'Escape' && inputSubtitutorValue != '') {
    let newListRowDescriptor = document.createElement('td');
    newListRowDescriptor.classList = 'listRowDescriptor';
    newListRowDescriptor.textContent = event.target.value;
    newListRowDescriptor.addEventListener('dblclick', handleTextSubstitution);

    event.target.removeEventListener('blur', substituteBackOnBlur);

    let parentListRow = event.target.parentNode;
    parentListRow.replaceChild(newListRowDescriptor, event.target);
  }
}

function createRowOnKeydown(event) {
  if (event.key == 'Enter') {
    handleRowCreation();
  }
}

function handleIndicatorClick(event) {
  let listRowIndicator = event.target;

  if (listRowIndicator.style.backgroundColor == crimson) {
    listRowIndicator.style.backgroundColor = forestgreen;
  } else if (listRowIndicator.style.backgroundColor == forestgreen) {
    listRowIndicator.style.backgroundColor = crimson;
  }
}

function addBehaviorToRowChildren(HTMLListRow) {
  let rowColumns = HTMLListRow.childNodes;

  for (let i = 0; i < rowColumns.length; i++) {
    if (rowColumns[i].classList == 'listRowIndicator') {
      rowColumns[i].addEventListener('click', handleIndicatorClick);
      rowColumns[i].draggable = true;
      rowColumns[i].addEventListener('dragstart', handleDragStart);
    } else if (rowColumns[i].classList == 'listRowDescriptor') {
      rowColumns[i].addEventListener('dblclick', handleTextSubstitution);
    }
  }
}

function initListRow(newListRow) {
  let listRowIndicator = document.createElement('td');
  listRowIndicator.classList.add('listRowIndicator');
  listRowIndicator.style.backgroundColor = defaultColor;

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('listRowDescriptor');
  listRowDescriptor.textContent = document.getElementById('inputBox').value;

  newListRow.classList.add('listRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);
  newListRow.addEventListener('click', handleClick);

  addBehaviorToRowChildren(newListRow);
}

function initList() {
  let newList = document.createElement('table');

  newList.id = 'list';
  newList.classList = 'list';

  let newListBody = newList.createTBody();
  newListBody.classList = 'listBody';
  newListBody.addEventListener('dragenter', (event) => {
    event.preventDefault();
    console.log('entering drag area');
    console.log(`event target: ${event.target}`);
    event.dataTransfer.dropEffect = 'move';
  });
  newListBody.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log('entering drag area again');
    event.dataTransfer.dropEffect = 'move';
  });
  newListBody.addEventListener('drop', handleDrop);

  return newList;
}

function handleRowCreation() {
  let list;

  if (document.getElementById('list') == undefined) {
    list = initList();

    let listDiv = document.getElementsByClassName('listDiv')[0];
    listDiv.appendChild(list);
  } else {
    list = document.getElementById('list');
  }

  let newListRow = list.insertRow(-1);
  initListRow(newListRow);
}
