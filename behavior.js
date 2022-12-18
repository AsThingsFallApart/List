let rowCreator = document.getElementById('creator');

rowCreator.addEventListener('click', createRow);

function createRow() {
  let container = document.getElementById('tableList');
  let inputText = document.getElementById('inputBox').value;

  let listRowIndicator = document.createElement('td');
  listRowIndicator.classList.add('tableListRowIndicator');

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('tableListRowDescriptor');
  listRowDescriptor.textContent = inputText;

  let newListRow = document.createElement('tr');
  newListRow.classList.add('tableListRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);

  container.appendChild(newListRow);
}
