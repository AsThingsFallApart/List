const crimson = 'rgb(220, 20, 60)';
const forestgreen = 'rgb(34, 139, 34)';

let defaultColor = crimson;
let placeholderExists = false;
let placeholderRowIndex = undefined;
let oldPlaceholderPredecessorIndex = 0;
let oldPlaceholderSuccessorIndex = 0;

let rowCreator = document.getElementById('creator');
rowCreator.addEventListener('click', handleRowCreation);

let rowTextInputBox = document.getElementById('inputBox');
rowTextInputBox.addEventListener('keydown', createRowOnKeydown);

let entireDocument = document.getElementsByClassName('html')[0];
entireDocument.addEventListener('dragenter', preventDefaultBehavior);
entireDocument.addEventListener('dragover', preventDefaultBehavior);
entireDocument.addEventListener('drop', handleDrop);

handleRowCreation(1);
handleRowCreation(2);
handleRowCreation(3);
handleRowCreation(4);
handleRowCreation(5);

/* ========================================= FUNCTIONS ============================================= */
// function handleDisplayingRowControl(event) {
//   let currentRow = event.target.parentNode;
//   console.dir(currentRow);
//   let rightmostChild = currentRow.lastChild;
//   let cursorXPos = event.offsetX;

//   let cursorXPercentile = cursorXPos / rightmostChild.offsetWidth;

//   console.log(`Rightmost element: ${rightmostChild}`);
//   console.log(`The cursor is at x-coord: ${cursorXPos}`);
//   console.log(`The cursor in the top ${cursorXPercentile * 100}% of the row.`);

//   if ((event.target = rightmostChild)) {
//     if (cursorXPercentile >= 0.95) {
//       // display row control
//     }
//   }
// }

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

/* ROW SEMANTICS:
 *
 * minYOffset
 *  |
 *  | ------------------------------------
 *  | |                                  | <-- "lower activation area" (lower 25% offsetY values)
 *  | |       {col1, col2.. coln}        | <-- "middle"                (deadzone, no behavior)
 *  | |                                  | <-- "upper activation area" (upper 25% offsetY values)
 *  | ------------------------------------
 *  |
 *  V
 * maxYOffset
 *
 */

function handlePlaceholderPositioning(event) {
  event.preventDefault();
  // console.log(`The cursor is at ${event.offsetX}, ${event.offsetY}.`);
  let pointerYPos = event.offsetY;
  let listBody = document.getElementsByClassName('listBody')[0];
  let draggedRow = document.getElementById('dragged');
  let draggedoverRow = event.target.parentNode;
  let draggedoverRowIndex = Array.prototype.indexOf.call(
    listBody.childNodes,
    draggedoverRow
  );
  let draggedRowIndex = Array.prototype.indexOf.call(
    listBody.childNodes,
    draggedRow
  );
  let predecessorIndex = draggedRowIndex - 1;
  let successorIndex = draggedRowIndex + 1;

  console.log(`\nThis list has ${listBody.childElementCount} rows:`);

  let listRows = listBody.rows;
  console.log('\t-----------------');
  for (let i = 0; i < listBody.childElementCount; i++) {
    if (listRows[i].classList == 'listRowPlaceholder') {
      console.log(`${i}:\t|\tplaceholder\t|`);
    } else {
      console.log(`${i}:\t|\t${listRows[i].textContent}\t\t\t|`);
    }
  }
  console.log('\t-----------------');

  console.log(`placeholderRowIndex: ${placeholderRowIndex}`);
  console.log(`draggedoverRowIndex: ${draggedoverRowIndex}`);
  console.log(`draggedRowIndex: ${draggedRowIndex}`);
  console.log(`predecessorIndex: ${predecessorIndex}`);
  console.log(`successorIndex: ${successorIndex}`);

  if (draggedoverRowIndex == predecessorIndex) {
    console.log(
      `Row at index ${draggedoverRowIndex} is the predecessor:\n\tIt's upper activation area is disabled.`
    );
  }

  if (draggedoverRowIndex == successorIndex) {
    console.log(
      `Row at index ${draggedoverRowIndex} is the successor:\n\tIt's lower activation are disabled.`
    );
  }

  let rowLowerYThreshold = draggedoverRow.offsetHeight / 4;
  let rowUpperYThreshold = draggedoverRow.offsetHeight - rowLowerYThreshold;

  // block placeholder positioning if dragging over the original dragged row
  if (
    draggedoverRowIndex + 1 != successorIndex ||
    draggedoverRowIndex - 1 != predecessorIndex
  ) {
    console.log('\tNot-dragged-row check passed.');
    console.log(
      `\t{draggedoverRowIndex + 1 != successorIndex}: ${
        draggedoverRowIndex + 1
      } != ${successorIndex}`
    );
    console.log(
      `\t{draggedoverRowIndex- 1 != predecessorIndex}: ${
        draggedoverRowIndex - 1
      } != ${predecessorIndex}`
    );
    // position placeholder row after the dragged over row
    if (
      pointerYPos >= rowUpperYThreshold &&
      draggedoverRowIndex != predecessorIndex
    ) {
      console.log('\t\tUpper pointer position check passed.');
      console.log(
        `\t\tIn the upper activation area of row at index ${draggedoverRowIndex}:`
      );
      console.log(
        `\t\t\t{cursorY >= rowUpperYThreshold}: ${pointerYPos} >= ${rowUpperYThreshold}`
      );
      console.log(
        `\t\tProposing to position placeholder at index ${
          draggedoverRowIndex + 1
        }...`
      );
      let newPlaceholderSuccessorIndex = draggedoverRowIndex + 2;
      let newPlaceholderPredecessorIndex = draggedoverRowIndex;
      console.log('\t\tCurrent placeholder pair:');
      console.log(
        `\t\t\toldPlaceholderSuccessorIndex: ${oldPlaceholderSuccessorIndex}`
      );
      console.log(
        `\t\t\toldPlaceholderTopNeightborIndex: ${oldPlaceholderPredecessorIndex}`
      );
      console.log('\t\tProposed placeholder pair:');
      console.log(
        `\t\t\tnewPlaceholderSuccessorIndex: ${newPlaceholderSuccessorIndex}`
      );
      console.log(
        `\t\t\tnewPlaceholderPredecessorIndex: ${newPlaceholderPredecessorIndex}`
      );

      if (
        newPlaceholderSuccessorIndex != oldPlaceholderSuccessorIndex ||
        newPlaceholderPredecessorIndex != oldPlaceholderPredecessorIndex
      ) {
        console.log('\t\t\tNew placeholder node pair check passed.');
        /* Delete existing placeholder row before inserting a new one */
        //  Consider encapsulating this conceptually unique functionality into a seperate function...
        if (placeholderRowIndex != undefined) {
          console.log('\t\t\t\tDeleting old placeholder:');
          console.log(
            `\t\t\t\t\tNumber of available rows: ${listBody.childElementCount}`
          );
          console.log(
            `\t\t\t\t\tTrying to delete placeholder from index ${placeholderRowIndex}...`
          );
          if (placeholderRowIndex == listBody.childElementCount) {
            // delete last row
            console.log(
              `\t\t\t\t\tPlaceholder is at the end of the list: deleting last row.`
            );
            listBody.deleteRow(-1);
          } else {
            console.log(
              `\t\t\t\t\tDeleting row at index ${placeholderRowIndex}.`
            );
            listBody.deleteRow(placeholderRowIndex);
          }
        }
        console.log(
          `\t\t\tPositioning placeholder at index ${draggedoverRowIndex + 1}...`
        );
        initPlaceholder(draggedoverRowIndex + 1);
        placeholderRowIndex = draggedoverRowIndex + 1;
        oldPlaceholderPredecessorIndex = newPlaceholderPredecessorIndex;
        oldPlaceholderSuccessorIndex = newPlaceholderSuccessorIndex;
        placeholderExists = true;
      }
      // position placeholder row before dragged over row
    } else if (
      pointerYPos <= rowLowerYThreshold &&
      draggedoverRowIndex != successorIndex
    ) {
      console.log('\t\tLower pointer positioning check passed.');
      console.log(
        `\t\tIn the lower activation area of row at index ${draggedoverRowIndex}:`
      );
      console.log(
        `\t\t\t{cursorY <= elementYThreshold}: ${pointerYPos} <= ${rowLowerYThreshold}`
      );
      console.log(
        `\t\tProposing to position placeholder at index ${draggedoverRowIndex}...`
      );
      let newPlaceholderSuccessorIndex = draggedoverRowIndex;
      let newPlaceholderPredecessorIndex = draggedoverRowIndex - 2;
      console.log('\t\tCurrent placeholder pair:');
      console.log(
        `\t\t\toldPlaceholderSuccessorIndex: ${oldPlaceholderSuccessorIndex}`
      );
      console.log(
        `\t\t\toldPlaceholderPredecessorIndex: ${oldPlaceholderPredecessorIndex}`
      );
      console.log('\t\tProposed placeholder pair:');
      console.log(
        `\t\t\tnewPlaceholderSuccessorIndex: ${newPlaceholderSuccessorIndex}`
      );
      console.log(
        `\t\t\tnewPlaceholderPredecessorIndex: ${newPlaceholderPredecessorIndex}`
      );

      if (
        newPlaceholderSuccessorIndex != oldPlaceholderSuccessorIndex ||
        newPlaceholderPredecessorIndex != oldPlaceholderPredecessorIndex
      ) {
        console.log('\t\t\tNew placeholder node pair check passed.');
        if (placeholderRowIndex != undefined) {
          console.log(`\t\t\t\tDeleting old placeholder:`);
          console.log(
            `\t\t\t\t\tNumber of available rows: ${listBody.childElementCount}`
          );
          console.log(
            `\t\t\t\t\tTrying to delete placeholder from index ${placeholderRowIndex}...`
          );
          if (placeholderRowIndex == listBody.childElementCount) {
            // delete last row in list
            console.log(
              `\t\t\t\t\tAvailable rows = placeholder index. Deleting last row...`
            );
            listBody.deleteRow(-1);
          } else {
            console.log(
              `\t\t\t\t\tDeleting row at index ${placeholderRowIndex}...`
            );
            listBody.deleteRow(placeholderRowIndex);
          }
        }
        console.log(
          `\t\t\tPositioning placeholder at index ${draggedoverRowIndex}...`
        );
        initPlaceholder(draggedoverRowIndex);
        placeholderRowIndex = draggedoverRowIndex;
        oldPlaceholderPredecessorIndex = newPlaceholderPredecessorIndex;
        oldPlaceholderSuccessorIndex = newPlaceholderSuccessorIndex;
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
  let draggedRow = document.getElementById('dragged');

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

    let draggedRowIndex = Array.prototype.indexOf.call(
      listBody.childNodes,
      draggedRow
    );
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

  draggedRow.id = '';

  placeholderRowIndex = undefined;
  placeholderExists = false;

  console.log(`placeholderExists: ${placeholderExists}`);
  console.log(`placeholderRowIndex: ${placeholderRowIndex}`);
}

function handleDragStart(event) {
  let draggedRow = event.target.parentNode;

  event.dataTransfer.setDragImage(draggedRow, 0, 0);
  event.dataTransfer.effectAllowed = 'move';

  event.dataTransfer.setData('application/x-moz-node', draggedRow.innerHTML);
  console.log(
    `event.target.parentNode.textContext: ${event.target.parentNode.textContent}`
  );
  event.dataTransfer.setData('text/plain', draggedRow.textContent);

  draggedRow.id = 'dragged';
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
  //   console.log('Substitutor element:');
  //   console.log(event.target);
  //   console.log('listRow Element:');
  //   console.log(event.target.parentNode);
  //   console.log('listBody element: ');
  //   console.log(event.target.parentNode.parentNode);
  //   console.log('list element:');
  //   console.log(event.target.parentNode.parentNode.parentNode);
  //   console.log('div element:');
  //   console.log(event.target.parentNode.parentNode.parentNode.parentNode);
  let listRowSubstitutorContent = event.target.value;

  if (event.key == 'Enter' && listRowSubstitutorContent == '') {
    event.target.removeEventListener('blur', handleRowDeletion);

    let rowWithEmptyDescriptor = event.target.parentNode;
    let listBody = event.target.parentNode.parentNode;
    let list = event.target.parentNode.parentNode.parentNode;

    listBody.removeChild(rowWithEmptyDescriptor);

    if (list.childNodes.length == 0) {
      list.parentNode.removeChild(list);
    }
  } else if (event.key == 'Escape' && listRowSubstitutorContent == '') {
    event.target.removeEventListener('blur', handleRowDeletion);

    let rowWithEmptyDescriptor = event.target.parentNode;
    let listBody = event.target.parentNode.parentNode;
    let list = event.target.parentNode.parentNode.parentNode;

    listBody.removeChild(rowWithEmptyDescriptor);

    if (list.childNodes.length == 0) {
      list.parentNode.removeChild(list);
    }
  } else if (event.type == 'blur' && listRowSubstitutorContent == '') {
    let rowWithEmptyDescriptor = event.target.parentNode;
    let listBody = event.target.parentNode.parentNode;
    let list = event.target.parentNode.parentNode.parentNode;

    listBody.removeChild(rowWithEmptyDescriptor);

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

function initList() {
  let newList = document.createElement('table');

  newList.id = 'list';
  newList.classList = 'list';

  let newListBody = newList.createTBody();
  newListBody.classList = 'listBody';

  return newList;
}

function initListRow(newListRow, rowContent = '') {
  let listRowIndicator = document.createElement('td');
  listRowIndicator.classList.add('listRowIndicator');
  listRowIndicator.style.backgroundColor = defaultColor;

  let listRowDescriptor = document.createElement('td');
  listRowDescriptor.classList.add('listRowDescriptor');
  if (rowContent != '') {
    listRowDescriptor.textContent = rowContent;
  } else {
    listRowDescriptor.textContent = document.getElementById('inputBox').value;
  }

  let listRowControl = document.createElement('td');
  listRowControl.classList = 'listRowControl';

  newListRow.classList.add('listRow');
  newListRow.appendChild(listRowIndicator);
  newListRow.appendChild(listRowDescriptor);
  newListRow.addEventListener('click', handleClick);
  newListRow.addEventListener('dragover', handlePlaceholderPositioning);

  addBehaviorToRowChildren(newListRow);
}

function handleRowCreation(rowContent = '') {
  let list;

  if (document.getElementById('list') == undefined) {
    list = initList();

    let listDiv = document.getElementsByClassName('listDiv')[0];
    listDiv.appendChild(list);
  } else {
    list = document.getElementById('list');
  }

  let newListRow = list.insertRow(-1);

  if (rowContent != '') {
    initListRow(newListRow, rowContent);
  } else {
    initListRow(newListRow);
  }
}
