const crimson = 'rgb(220, 20, 60)';
const forestgreen = 'rgb(34, 139, 34)';

let defaultColor = crimson;
let oldPlaceholderRowIndex = undefined;
let newPlaceholderRowIndex = undefined;
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

function printList() {
  let listBody = document.getElementsByClassName('listBody')[0];
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
}

function preventDefaultBehavior(event) {
  event.preventDefault();
}

function insertPlaceholder(insertionIndex) {
  let listBody = document.getElementsByClassName('listBody')[0];
  let copiedListRowPlaceholder;

  let listRowIndicatorPlaceholder = document.createElement('td');
  listRowIndicatorPlaceholder.classList = 'listRowIndicatorPlaceholder';

  let listRowDescriptorPlaceholder = document.createElement('td');
  listRowDescriptorPlaceholder.classList = 'listRowDescriptorPlaceholder';

  copiedListRowPlaceholder = listBody.insertRow(insertionIndex);
  copiedListRowPlaceholder.classList = 'listRowPlaceholder';
  copiedListRowPlaceholder.appendChild(listRowIndicatorPlaceholder);
  copiedListRowPlaceholder.appendChild(listRowDescriptorPlaceholder);

  copiedListRowPlaceholder.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log('Cursor is over the placeholder.');
    event.dataTransfer.dropEffect = 'move';
  });
  copiedListRowPlaceholder.addEventListener('dragenter', (event) => {
    event.preventDefault();
    console.log('Cursor has entered the placeholder area');
  });
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
  let activtionAreaPercentage = 0.33;
  let rowLowerYThreshold =
    draggedoverRow.offsetHeight * activtionAreaPercentage;
  let rowUpperYThreshold = draggedoverRow.offsetHeight - rowLowerYThreshold;
  let draggedOverRowisOriginalDraggedRow =
    draggedoverRowIndex + 1 == successorIndex &&
    draggedoverRowIndex - 1 == predecessorIndex;

  // block placeholder positioning if dragging over the original dragged row
  console.log(
    `\nRow before dragged over row is predecessor: ${
      draggedoverRowIndex - 1 == predecessorIndex
    }`
  );
  console.log(
    `Row after dragged over row is successor: ${
      draggedoverRowIndex + 1 == successorIndex
    }`
  );

  if (!draggedOverRowisOriginalDraggedRow) {
    console.log(
      'Dragged over row is not in between predecessor and successor.\n\tNot-dragged-row check passed.'
    );
    console.log(`This list has ${listBody.childElementCount} rows:`);
    printList();

    console.log(`oldPlaceholderRowIndex:\t${oldPlaceholderRowIndex}`);
    console.log(`draggedoverRowIndex:\t${draggedoverRowIndex}`);
    console.log(`draggedRowIndex:\t\t${draggedRowIndex}`);
    console.log(`\tpredecessorIndex:\t\t${predecessorIndex}`);
    console.log(`\tsuccessorIndex:\t\t\t${successorIndex}`);

    if (draggedoverRowIndex == predecessorIndex) {
      console.log(
        `draggedoverRow is the predecessor:\n\tIt's upper activation area is disabled.`
      );
    }

    if (draggedoverRowIndex == successorIndex) {
      console.log(
        `draggedoverRow is the successor:\n\tIt's lower activation is disabled.`
      );
    }
    console.log(
      'Checking to see if pointer is in an activation area AND\n\tthe dragged over row is not a predecessor or successor...'
    );
    console.log(
      `\t\tpointerYPos:\t\t${pointerYPos}\n\t\trowLowerYThreshold:\t${rowLowerYThreshold}\n\t\trowUpperYThreshold:\t${rowUpperYThreshold}`
    );
    console.log(
      `\t{pointerYPos <= rowLowerYThreshold}: ${
        pointerYPos <= rowLowerYThreshold
      }`
    );
    console.log(
      `\t{draggedoverRowIndex != successorIndex}: ${draggedoverRowIndex} != ${successorIndex} (${
        draggedoverRowIndex != successorIndex
      })`
    );
    console.log(
      `\t{pointerYPos >= rowUpperYThreshold}: ${
        pointerYPos >= rowUpperYThreshold
      }`
    );
    console.log(
      `\t{draggedoverRowIndex != predecessorIndex}: ${draggedoverRowIndex} != ${predecessorIndex} (${
        draggedoverRowIndex != predecessorIndex
      })`
    );
    /* ----- Lower Activation Area: position placeholder row before dragged over row ----- */
    if (
      pointerYPos <= rowLowerYThreshold &&
      draggedoverRowIndex != successorIndex
    ) {
      console.log('\t\tLower activation area check passed.');

      newPlaceholderRowIndex = draggedoverRowIndex;
      console.log(
        `\t\tProposing to position placeholder at index ${newPlaceholderRowIndex}...`
      );

      let newPlaceholderPredecessorIndex;
      let newPlaceholderSuccessorIndex;

      console.log(
        `oldPlaceholderRowIndex < newPlaceholderRowIndex: ${oldPlaceholderRowIndex} < ${newPlaceholderRowIndex}\n${
          oldPlaceholderRowIndex < newPlaceholderRowIndex
        }`
      );
      if (oldPlaceholderRowIndex < newPlaceholderRowIndex) {
        newPlaceholderPredecessorIndex = newPlaceholderRowIndex - 2;
        newPlaceholderSuccessorIndex = newPlaceholderRowIndex;
      } else {
        newPlaceholderPredecessorIndex = newPlaceholderRowIndex - 1;
        newPlaceholderSuccessorIndex = newPlaceholderRowIndex + 1;
      }
      console.log('\t\tCurrent placeholder pair:');
      console.log(
        `\t\t\toldPlaceholderPredecessorIndex: ${oldPlaceholderPredecessorIndex}`
      );
      console.log(
        `\t\t\toldPlaceholderSuccessorIndex: ${oldPlaceholderSuccessorIndex}`
      );
      console.log('\t\tProposed placeholder pair:');
      console.log(
        `\t\t\tnewPlaceholderPredecessorIndex: ${newPlaceholderPredecessorIndex}`
      );
      console.log(
        `\t\t\tnewPlaceholderSuccessorIndex: ${newPlaceholderSuccessorIndex}`
      );

      if (
        newPlaceholderSuccessorIndex != oldPlaceholderSuccessorIndex ||
        newPlaceholderPredecessorIndex != oldPlaceholderPredecessorIndex
      ) {
        console.log('\t\t\tNew placeholder node pair check passed.');
        console.log(
          `\t\t\tPositioning placeholder at index ${draggedoverRowIndex}...`
        );
        insertPlaceholder(newPlaceholderRowIndex);
        oldPlaceholderPredecessorIndex = newPlaceholderPredecessorIndex;
        oldPlaceholderSuccessorIndex = newPlaceholderSuccessorIndex;

        printList();
        console.log('\t\t\t\tInsertion successful.');
        console.log(
          `\t\t\t\tChecking if old placeholder exists...\n\t\t\t\t\toldPlaceholderRowIndex:\t${oldPlaceholderRowIndex}\n\t\t\t\t\tnewPlaceholderRowIndex:\t${newPlaceholderRowIndex}`
        );

        // delete old placeholder row if placeholder is at a different index
        if (
          newPlaceholderRowIndex != oldPlaceholderRowIndex &&
          oldPlaceholderRowIndex != undefined
        ) {
          console.log(`\t\t\t\tDeleting old placeholder:`);
          console.log(
            `\t\t\t\t\tNumber of available rows: ${listBody.childElementCount}`
          );

          // state: old placeholder exists and new placeholder positioned before in the list
          if (newPlaceholderRowIndex < oldPlaceholderRowIndex) {
            // old placeholder's index was incremented after new placeholder inserted before
            oldPlaceholderRowIndex++;
          }
          console.log(
            `\t\t\t\t\tDeleting row at index ${oldPlaceholderRowIndex}.`
          );
          listBody.deleteRow(oldPlaceholderRowIndex);

          printList();
        }

        // state: old placeholder in list and new placeholder is positioned later in the list
        if (oldPlaceholderRowIndex < newPlaceholderRowIndex) {
          oldPlaceholderRowIndex = --newPlaceholderRowIndex;
        } else {
          // state: new placeholder is positioned before old placeholder or first initialization
          oldPlaceholderRowIndex = newPlaceholderRowIndex;
        }
      }
      /* ----- Upper Activation Area: position placeholder row after the dragged over row ----- */
    } else if (
      pointerYPos >= rowUpperYThreshold &&
      draggedoverRowIndex != predecessorIndex
    ) {
      console.log('\t\tUpper activation area check passed.');

      newPlaceholderRowIndex = draggedoverRowIndex + 1;
      console.log(
        `\t\tProposing to position placeholder at index ${newPlaceholderRowIndex}...`
      );

      let newPlaceholderPredecessorIndex;
      let newPlaceholderSuccessorIndex;
      // the new placeholder pair values have to take into account where the current placeholder is...
      if (oldPlaceholderRowIndex < newPlaceholderRowIndex) {
        // the new placeholder predecessor/successor indexes will shift back 1 after deletion
        newPlaceholderPredecessorIndex = draggedoverRowIndex - 1;
        newPlaceholderSuccessorIndex = draggedoverRowIndex + 1;
      } else {
        newPlaceholderPredecessorIndex = draggedoverRowIndex;
        newPlaceholderSuccessorIndex = draggedoverRowIndex + 2;
      }

      console.log('\t\tCurrent placeholder pair:');
      console.log(
        `\t\t\toldPlaceholderPredecessorIndex: ${oldPlaceholderPredecessorIndex}`
      );
      console.log(
        `\t\t\toldPlaceholderSuccessorIndex: ${oldPlaceholderSuccessorIndex}`
      );
      console.log('\t\tProposed placeholder pair:');
      console.log(
        `\t\t\tnewPlaceholderPredecessorIndex: ${newPlaceholderPredecessorIndex}`
      );
      console.log(
        `\t\t\tnewPlaceholderSuccessorIndex: ${newPlaceholderSuccessorIndex}`
      );

      if (
        newPlaceholderSuccessorIndex != oldPlaceholderSuccessorIndex ||
        newPlaceholderPredecessorIndex != oldPlaceholderPredecessorIndex
      ) {
        console.log('\t\t\tNew placeholder node pair check passed.');

        console.log(
          `\t\t\t\tPositioning placeholder at index ${newPlaceholderRowIndex}...`
        );
        insertPlaceholder(newPlaceholderRowIndex);
        oldPlaceholderPredecessorIndex = newPlaceholderPredecessorIndex;
        oldPlaceholderSuccessorIndex = newPlaceholderSuccessorIndex;

        printList();
        console.log('\t\t\t\tInsertion successful.');
        console.log(
          `\t\t\t\tChecking if old placeholder exists...\n\t\t\t\t\toldPlaceholderRowIndex:\t${oldPlaceholderRowIndex}\n\t\t\t\t\tnewPlaceholderRowIndex:\t${newPlaceholderRowIndex}`
        );

        /* Delete existing placeholder row before inserting a new one */
        //  Consider encapsulating this conceptually unique functionality into a seperate function...
        if (
          newPlaceholderRowIndex != oldPlaceholderRowIndex &&
          oldPlaceholderRowIndex != undefined
        ) {
          console.log('\t\t\t\tDeleting old placeholder:');
          console.log(
            `\t\t\t\t\tDeleting row at index ${oldPlaceholderRowIndex}.`
          );
          listBody.deleteRow(oldPlaceholderRowIndex);

          printList();
        }

        // state: old placeholder exists and new placeholder was placed further in the list
        if (oldPlaceholderRowIndex < newPlaceholderRowIndex) {
          oldPlaceholderRowIndex = --newPlaceholderRowIndex;
          console.log(
            // new placeholder row will shift back 1 after deletion of old placeholder row
            `\t\t\tDeletion operation of old placeholder has shifted new placeholder index back one index:\n\t\t\t\toldPlaceholderRowIndex = ${oldPlaceholderRowIndex}`
          );
        } else {
          // state: placeholder does not exist
          oldPlaceholderRowIndex = newPlaceholderRowIndex;
          console.log(
            `\t\t\toldplaceholderRowIndex = ${oldPlaceholderRowIndex}`
          );
        }
      }
    }
  }
}

function handleClick(event) {
  let clickedRow = event.target;

  console.log(`ID of ${clickedRow}: ${clickedRow.id}`);
  console.log(`Content of ${clickedRow}: ${clickedRow.textContent}`);
  console.dir(clickedRow);
}

/* handleDrop: on drop event, replace placeholder row with dragged row. */
function handleDrop(event) {
  event.preventDefault();
  let draggedRow = document.getElementById('dragged');

  console.log('\ndropped');
  console.log(`event.target: ${event.target}`);
  console.log(`event.target.classList: ${event.target.classList}`);
  console.log(
    `event.dataTransfer.data: ${event.dataTransfer.getData(
      'application/x-moz-node'
    )}`
  );

  console.log('The event:');
  console.log(event);

  if (newPlaceholderRowIndex != undefined) {
    //  1. delete the dragged row
    //  2. delete the placeholder row
    //  3. insert the copied row at the index of the placeholder row
    let listBody = document.getElementsByClassName('listBody')[0];

    //  1.
    let draggedRowIndex = Array.prototype.indexOf.call(
      listBody.childNodes,
      draggedRow
    );
    console.log(`draggedRowIndex: ${draggedRowIndex}`);

    listBody.deleteRow(draggedRowIndex);

    //  2.
    // state: deletion operation on dragged row shifts placeholder index back one
    if (draggedRowIndex < oldPlaceholderRowIndex) {
      oldPlaceholderRowIndex == --oldPlaceholderRowIndex;
    }

    listBody.deleteRow(oldPlaceholderRowIndex);

    //  3.
    let copiedListRow = listBody.insertRow(oldPlaceholderRowIndex);
    let draggedRowInnerHTML = event.dataTransfer.getData(
      'application/x-moz-node'
    );
    console.log(`draggedRowInnerHTML: ${draggedRowInnerHTML}`);

    copiedListRow.innerHTML = draggedRowInnerHTML;
    copiedListRow.classList = 'listRow';
    copiedListRow.addEventListener('dragover', handlePlaceholderPositioning);
    addBehaviorToRowChildren(copiedListRow);
  }

  draggedRow.id = '';

  oldPlaceholderRowIndex = undefined;
  newPlaceholderRowIndex = undefined;

  console.log(
    `oldPlaceholderRowIndex:\t${oldPlaceholderRowIndex}\nnewPlaceholderRowIndex:\t${newPlaceholderRowIndex}`
  );
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
    let copiedListRowDescriptor = document.createElement('td');
    copiedListRowDescriptor.classList = 'listRowDescriptor';
    copiedListRowDescriptor.textContent = event.target.value;
    copiedListRowDescriptor.addEventListener(
      'dblclick',
      handleTextSubstitution
    );

    let parentListRow = event.target.parentNode;
    parentListRow.replaceChild(copiedListRowDescriptor, event.target);
  }
}

function substituteBackOnKeydown(event) {
  let inputSubtitutorValue = event.target.value;

  if (event.key == 'Enter' && inputSubtitutorValue != '') {
    let copiedListRowDescriptor = document.createElement('td');
    copiedListRowDescriptor.classList = 'listRowDescriptor';
    copiedListRowDescriptor.textContent = event.target.value;
    copiedListRowDescriptor.addEventListener(
      'dblclick',
      handleTextSubstitution
    );

    event.target.removeEventListener('blur', substituteBackOnBlur);

    let parentListRow = event.target.parentNode;
    parentListRow.replaceChild(copiedListRowDescriptor, event.target);
  } else if (event.key == 'Escape' && inputSubtitutorValue != '') {
    let copiedListRowDescriptor = document.createElement('td');
    copiedListRowDescriptor.classList = 'listRowDescriptor';
    copiedListRowDescriptor.textContent = event.target.value;
    copiedListRowDescriptor.addEventListener(
      'dblclick',
      handleTextSubstitution
    );

    event.target.removeEventListener('blur', substituteBackOnBlur);

    let parentListRow = event.target.parentNode;
    parentListRow.replaceChild(copiedListRowDescriptor, event.target);
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
    // console.log(
    //   `Initializing descriptor element with hardcoded value "${rowContent}".`
    // );
    listRowDescriptor.textContent = rowContent;
  } else {
    // console.log(
    //   `Optional parameter 'rowContent' uninitialized. Using textbox value: ${
    //     document.getElementById('inputBox').value
    //   }`
    // );
    listRowDescriptor.textContent = document.getElementById('inputBox').value;
  }

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

  // console.log(typeof rowContent);
  if (typeof rowContent != 'object') {
    // console.log(rowContent);
    initListRow(newListRow, rowContent);
  } else {
    // console.log(rowContent);
    initListRow(newListRow);
  }
}
