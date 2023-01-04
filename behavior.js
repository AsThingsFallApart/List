const crimson = 'rgb(220, 20, 60)';
const forestgreen = 'rgb(34, 139, 34)';

let defaultColor = crimson;
let isDragging = false;
let dragOrigin = 0;
let placeholderExists = false;
let placeholderRowIndex = undefined;
let oldPlaceholderTopNeighborIndex = 0;
let oldPlaceholderBottomNeighborIndex = 0;

let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', handleRowCreation);

let rowTextInputBox = document.getElementById('inputBox');
rowTextInputBox.addEventListener('keydown', createRowOnKeydown);

let entireDocument = document.getElementsByClassName('html')[0];
entireDocument.addEventListener('dragenter', preventDefaultBehavior);
entireDocument.addEventListener('dragover', preventDefaultBehavior);
entireDocument.addEventListener('drop', handleDrop);

function preventDefaultBehavior(event) {
  event.preventDefault();
}

function initPlaceholder(insertionIndex) {
  let listBody = document.getElementsByClassName('listBody')[0];
  let newListRowPlaceholder;

  let listRowIndicatorPlaceholder = document.createElement('td');
  listRowIndicatorPlaceholder.classList = 'listRowIndicatorPlaceholder';

  let listRowDescriptorPlaceholder = document.createElement('td');
  listRowDescriptorPlaceholder.classList = 'listRowDescriptorPlaceholder';

  console.dir(listBody);

  if (insertionIndex < listBody.childElementCount) {
    newListRowPlaceholder = listBody.insertRow(insertionIndex);
    newListRowPlaceholder.classList = 'listRowPlaceholder';
    newListRowPlaceholder.appendChild(listRowIndicatorPlaceholder);
    newListRowPlaceholder.appendChild(listRowDescriptorPlaceholder);
  } else {
    newListRowPlaceholder = document.createElement('tr');
    newListRowPlaceholder.classList = 'listRowPlaceholder';
    newListRowPlaceholder.appendChild(listRowIndicatorPlaceholder);
    newListRowPlaceholder.appendChild(listRowDescriptorPlaceholder);
    listBody.appendChild(newListRowPlaceholder);
  }

  newListRowPlaceholder.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log('Cursor is over the placeholder.');
    event.dataTransfer.dropEffect = 'move';
  });
  newListRowPlaceholder.addEventListener('dragenter', (event) => {
    event.preventDefault();
    console.log('Cursor has entered the placeholder area');
  });
  newListRowPlaceholder.addEventListener('drop', handleDrop);
}

function handlePlaceholderPositioning(event) {
  event.preventDefault();
  // console.log(`The cursor is at ${event.offsetX}, ${event.offsetY}.`);
  let currentRow = event.target.parentNode;
  let listBody = document.getElementsByClassName('listBody')[0];
  let currentRowIndex = Array.prototype.indexOf.call(
    listBody.childNodes,
    currentRow
  );
  let topNeighborIndex = dragOrigin - 1;
  let bottomNeighborIndex = dragOrigin + 1;
  console.log(`dragOrigin: ${dragOrigin}`);
  console.log(`topNeighborIndex: ${topNeighborIndex}`);
  console.log(`bottomNeightborIndex: ${bottomNeighborIndex}`);
  console.log(`currentRowIndex: ${currentRowIndex}`);
  console.log(`placeholderRowIndex: ${placeholderRowIndex}`);

  if (currentRowIndex == topNeighborIndex) {
    console.log(`This element ${currentRowIndex} is the top neighbor.`);
  }

  if (currentRowIndex == bottomNeighborIndex) {
    console.log(`This element ${currentRowIndex} is the bottom neighbor.`);
  }

  let rowOffsetYBottomFourth = currentRow.offsetHeight / 4;
  let rowOffsetYTopFourth = currentRow.offsetHeight - rowOffsetYBottomFourth;

  if (
    currentRowIndex + 1 != bottomNeighborIndex ||
    currentRowIndex - 1 != topNeighborIndex
  ) {
    if (
      event.offsetY > rowOffsetYTopFourth &&
      currentRowIndex != topNeighborIndex
    ) {
      // position placeholder below the row
      let newPlaceholderTopNeighborIndex = currentRowIndex;
      let newPlaceholderBottomNeighborIndex = currentRowIndex + 2;
      console.log(`\tIn the lower half of element ${currentRowIndex}`);
      console.log(`\tPlacing placeholder below current row...`);
      console.log(`\tyThreshold: ${rowOffsetYTopFourth}`);
      console.log(`\tevent.offsetY: ${event.offsetY}`);
      console.log(`\tcurrentRowIndex: ${currentRowIndex}`);
      console.log('\tCurrent placeholder pair:');
      console.log(
        `\t\toldPlaceholderBottomNeighborIndex: ${oldPlaceholderBottomNeighborIndex}`
      );
      console.log(
        `\t\toldPlaceholderTopNeightborIndex: ${oldPlaceholderTopNeighborIndex}`
      );
      console.log('\tProposed placeholder pair:');
      console.log(
        `\t\tnewPlaceholderBottomNeighborIndex ${newPlaceholderBottomNeighborIndex}`
      );
      console.log(
        `\t\tnewPlaceholderTopNeightborIndex: ${newPlaceholderTopNeighborIndex}`
      );

      if (
        newPlaceholderBottomNeighborIndex !=
          oldPlaceholderBottomNeighborIndex ||
        newPlaceholderTopNeighborIndex != oldPlaceholderTopNeighborIndex
      ) {
        if (placeholderRowIndex != undefined) {
          console.log(
            `\tNumber of available rows: ${listBody.childElementCount}`
          );
          console.log(
            `\tTrying to delete placeholder from index ${placeholderRowIndex}...`
          );
          if (placeholderRowIndex == listBody.childElementCount) {
            // delete last row
            console.log(
              `Placeholder is at the end of the list: deleting last row.`
            );
            listBody.deleteRow(-1);
          } else {
            console.log(`Deleting row at index ${placeholderRowIndex}`);
            listBody.deleteRow(placeholderRowIndex);
          }
        }
        console.log(`Positioning placeholder at ${currentRowIndex + 1}...`);
        initPlaceholder(currentRowIndex + 1);
        placeholderRowIndex = currentRowIndex + 1;
        oldPlaceholderTopNeighborIndex = newPlaceholderTopNeighborIndex;
        oldPlaceholderBottomNeighborIndex = newPlaceholderBottomNeighborIndex;
        placeholderExists = true;
      }
    } else if (
      event.offsetY < rowOffsetYBottomFourth &&
      currentRowIndex != bottomNeighborIndex
    ) {
      // position placeholder above the row
      let newPlaceholderTopNeighborIndex = currentRowIndex - 2;
      let newPlaceholderBottomNeighborIndex = currentRowIndex;
      console.log(`\tIn the upper half of element ${currentRowIndex}`);
      console.log(`\tPlacing placeholder above current row...`);
      console.log(`\tyThreshold: ${rowOffsetYBottomFourth}`);
      console.log(`\tevent.offsetY: ${event.offsetY}`);
      console.log(`\tcurrentRowIndex: ${currentRowIndex}`);
      console.log('\tCurrent placeholder pair:');
      console.log(
        `\t\toldPlaceholderBottomNeighborIndex: ${oldPlaceholderBottomNeighborIndex}`
      );
      console.log(
        `\t\toldPlaceholderTopNeightborIndex: ${oldPlaceholderTopNeighborIndex}`
      );
      console.log('\tProposed placeholder pair:');
      console.log(
        `\t\tnewPlaceholderBottomNeighborIndex ${newPlaceholderBottomNeighborIndex}`
      );
      console.log(
        `\t\tnewPlaceholderTopNeightborIndex: ${newPlaceholderTopNeighborIndex}`
      );

      if (
        newPlaceholderBottomNeighborIndex !=
          oldPlaceholderBottomNeighborIndex ||
        newPlaceholderTopNeighborIndex != oldPlaceholderTopNeighborIndex
      ) {
        console.log(`Positioning placeholder at ${currentRowIndex}...`);
        if (placeholderRowIndex != undefined) {
          console.log(
            `Number of available rows: ${listBody.childElementCount}`
          );
          console.log(
            `Trying to delete placeholder from index ${placeholderRowIndex}...`
          );
          if (placeholderRowIndex == listBody.childElementCount) {
            // delete last row in list
            console.log(
              `Available rows = placeholder index. Deleting last row...`
            );
            listBody.deleteRow(-1);
          } else {
            console.log(`Deleting row at index ${placeholderRowIndex}...`);
            listBody.deleteRow(placeholderRowIndex);
          }
        }
        initPlaceholder(currentRowIndex);
        placeholderRowIndex = currentRowIndex;
        oldPlaceholderTopNeighborIndex = newPlaceholderTopNeighborIndex;
        oldPlaceholderBottomNeighborIndex = newPlaceholderBottomNeighborIndex;
        placeholderExists = true;
      }
    }
  }
}

function handleClick(event) {
  let clickedRow = event.target;

  console.log(`ID of ${clickedRow}: ${clickedRow.id}`);
  console.log(`Content of ${clickedRow}: ${clickedRow.textContent}`);
  console.dir(clickedRow);
  console.log(`placeholderExists: ${placeholderExists}`);
}

function handleDrop(event) {
  event.preventDefault();
  console.log('dropped');
  console.log(`event.target.classList: ${event.target.classList}`);
  console.log(
    `event.dataTransfer.data: ${event.dataTransfer.getData(
      'application/x-moz-node'
    )}`
  );
  console.log(`boolean 'placeholderExists': ${placeholderExists}`);

  console.log('The event:');
  console.log(event);

  if (placeholderExists) {
    let listBody = document.getElementsByClassName('listBody')[0];
    let newListRow;

    let draggedRowInnerHTML = event.dataTransfer.getData(
      'application/x-moz-node'
    );
    console.log(`draggedRowInnerHTML: ${draggedRowInnerHTML}`);

    let draggedRowIndex = event.dataTransfer.getData('index');
    console.log(`draggedRowIndex: ${draggedRowIndex}`);

    if (placeholderRowIndex > listBody.childElementCount) {
      listBody.appendChild(newListRow);
      listBody.deleteRow(placeholderRowIndex);
    } else {
      if (placeholderRowIndex == listBody.childElementCount) {
        listBody.deleteRow(-1);
        newListRow = listBody.insertRow(placeholderRowIndex - 1);
      } else {
        listBody.deleteRow(placeholderRowIndex);
        newListRow = listBody.insertRow(placeholderRowIndex);
      }
    }

    if (placeholderRowIndex < draggedRowIndex) {
      draggedRowIndex++;
    }

    if (draggedRowIndex == listBody.childElementCount) {
      listBody.deleteRow(-1);
    } else {
      listBody.deleteRow(draggedRowIndex);
    }

    newListRow.innerHTML = draggedRowInnerHTML;
    newListRow.classList = 'listRow';
    newListRow.addEventListener('dragover', handlePlaceholderPositioning);
    addBehaviorToRowChildren(newListRow);
  }

  placeholderRowIndex = undefined;
  placeholderExists = false;

  console.log(`placeholderExists: ${placeholderExists}`);
  console.log(`placeholderRowIndex: ${placeholderRowIndex}`);
}

function handleDragStart(event) {
  let draggedRow = event.target.parentNode;

  console.log(`isDragging: ${isDragging}`);

  event.dataTransfer.setDragImage(draggedRow, 0, 0);
  event.dataTransfer.effectAllowed = 'move';

  event.dataTransfer.setData('application/x-moz-node', draggedRow.innerHTML);
  console.log(
    `event.target.parentNode.textContext: ${event.target.parentNode.textContent}`
  );
  event.dataTransfer.setData('text/plain', draggedRow.textContent);

  let listBody = draggedRow.parentNode;

  console.log(draggedRow);

  let draggedRowIndex = Array.prototype.indexOf.call(
    listBody.childNodes,
    draggedRow
  );
  event.dataTransfer.setData('index', draggedRowIndex);
  dragOrigin = draggedRowIndex;
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
  newListRow.addEventListener('dragover', handlePlaceholderPositioning);

  addBehaviorToRowChildren(newListRow);
}

function initList() {
  let newList = document.createElement('table');

  newList.id = 'list';
  newList.classList = 'list';

  let newListBody = newList.createTBody();
  newListBody.classList = 'listBody';

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
