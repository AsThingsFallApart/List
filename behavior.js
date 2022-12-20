let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', handleRowCreation);

let rowTextInputBox = document.getElementById('inputBox');
rowTextInputBox.addEventListener('keydown', createRowOnEnter);

function createRowOnEnter(event) {
  if (event.key == 'Enter') {
    handleRowCreation();
  }
}

function handleIndicatorClick(event) {
  if (event.target.classList == 'tableListRowIndicatorWaitlist') {
    event.target.classList = 'tableListRowIndicatorOpen';
  } else if (event.target.classList == 'tableListRowIndicatorOpen') {
    event.target.classList = 'tableListRowIndicatorWaitlist';
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
  listRowIndicator.classList.add('tableListRowIndicatorWaitlist');
  listRowIndicator.addEventListener('click', handleIndicatorClick);

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('tableListRowDescriptor');
  listRowDescriptor.textContent = inputText;

  let newListRow = document.createElement('tr');
  newListRow.classList.add('tableListRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);

  list.appendChild(newListRow);
}
