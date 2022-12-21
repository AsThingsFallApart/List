let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', handleRowCreation);

let rowTextInputBox = document.getElementById('inputBox');
rowTextInputBox.addEventListener('keydown', createRowOnEnter);

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
  console.log(`Element with raised event: ${event.target}`);
  console.log(
    `Element with raised event's content: ${tableListRowSubstitutorContent}`
  );
  console.log(`Event type: ${event.type}`);
  // console.log(`Element with rasied event's parent: ${event.target.parentNode}`);
  // console.log(
  //   `Element with raised event's parent's parent: ${event.target.parentNode.parentNode}`
  // );

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

function createRowOnEnter(event) {
  if (event.key == 'Enter') {
    handleRowCreation();
  }
}

function handleIndicatorClick(event) {
  if (event.target.classList == 'tableListRowIndicatorClosed') {
    event.target.classList = 'tableListRowIndicatorOpen';
  } else if (event.target.classList == 'tableListRowIndicatorOpen') {
    event.target.classList = 'tableListRowIndicatorClosed';
  }
}

function handleRowCreation() {
  let list;

  if (document.getElementById('tableList') == undefined) {
    list = document.createElement('table');
    list.id = 'tableList';
    list.classList = 'tableList';

    let listArea = document.getElementsByClassName('list')[0];
    listArea.appendChild(list);
  } else {
    list = document.getElementById('tableList');
  }

  let inputText = document.getElementById('inputBox').value;

  let listRowIndicator = document.createElement('td');
  listRowIndicator.classList.add('tableListRowIndicatorClosed');
  listRowIndicator.addEventListener('click', handleIndicatorClick);

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('tableListRowDescriptor');
  listRowDescriptor.textContent = inputText;
  listRowDescriptor.addEventListener('dblclick', handleTextSubstitution);

  let newListRow = document.createElement('tr');
  newListRow.classList.add('tableListRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);

  list.appendChild(newListRow);
}
