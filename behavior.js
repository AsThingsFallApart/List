let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', createRow);

function handleIndicatorClick(event) {
  if (event.target.classList == 'tableListRowIndicatorWaitlist') {
    event.target.classList = 'tableListRowIndicatorOpen';
  } else if (event.target.classList == 'tableListRowIndicatorOpen') {
    event.target.classList = 'tableListRowIndicatorWaitlist';
  }
}

function createRow() {
  let list = document.getElementById('tableList');
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
