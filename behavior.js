let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', createRow);

let rowIndicatorsWaitlist = document.getElementsByClassName(
  'tableListRowIndicatorWaitlist'
);
for (let i = 0; i < rowIndicatorsWaitlist.length; i++) {
  rowIndicatorsWaitlist[i].addEventListener('click', handleIndicatorClick);
}

let rowIndicatorsOpen = document.getElementsByClassName(
  'tableListRowIndicatorOpen'
);
for (let i = 0; i < rowIndicatorsOpen.length; i++) {
  rowIndicatorsOpen[i].addEventListener('click', handleIndicatorClick);
}

console.log(rowIndicatorsWaitlist);
console.log(rowIndicatorsOpen);

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

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('tableListRowDescriptor');
  listRowDescriptor.textContent = inputText;

  let newListRow = document.createElement('tr');
  newListRow.classList.add('tableListRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);

  list.appendChild(newListRow);
}
