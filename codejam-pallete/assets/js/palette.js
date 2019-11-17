const panel = new Panel();

/** *****************KEYBOARD FUNCTIONS****************** */

function changeTool(key) {
  // console.log(key);
  panel.removeTool = panel.activeTool;
  panel.activeTool = key;
  panel.setStorageTool();
  panel.removeActiveTool();
  panel.addActiveTool();
}

function keyboardChangeTool(key) {
  changeTool(key);
}


// mouse change
function mouseChangeTool() {
  const key = (this.getAttribute('id'));
  changeTool(key);
}


/** *****************KEYBOARD FUNCTIONS****************** */
function selectTool(e) {
  // console.log(e.code);
  switch (e.code) {
    case 'KeyB': keyboardChangeTool('fill'); // fill bucket
      break;
    case 'KeyP': keyboardChangeTool('pencil');// pencil
      break;
    case 'KeyC': keyboardChangeTool('picker');// picker
      break;
    default: break;
  }
}


/** ******* COLOR PANEL ******** */
function updateColor(newColor, toUpdatePrevColor = false) {
  if (toUpdatePrevColor) {
    panel.prevColor = panel.currentColor;
    document.getElementById('prevColor').value = panel.prevColor;
    localStorage.setItem('prevColor', document.getElementById('prevColor').value);
  }
  panel.currentColor = newColor;
  document.getElementById('currentColor').value = panel.currentColor;
  // console.log("change " + panel.prevColor + " to " + panel.currentColor);
  localStorage.setItem('currentColor', document.getElementById('currentColor').value);
}

// add color listener
document.getElementById('currentColor').addEventListener('change', () => {
  const newColor = document.getElementById('currentColor').value;
  updateColor(newColor);
});

document.getElementById('prev').addEventListener('mouseup', () => {
  const color = (document.getElementById('prevColor').value);
  // console.log(color);
  updateColor(color, true);
});

document.getElementById('red').addEventListener('mouseup', () => {
  const color = (document.getElementById('redColor').value);
  updateColor(color, true);
});

document.getElementById('blue').addEventListener('mouseup', () => {
  const color = (document.getElementById('blueColor').value);
  updateColor(color, true);
});

/** ******* COLOR PANEL ******** */

//  add panel listener
const elem = document.getElementsByClassName('tools_item');
for (let i = 0; i < panel.tools.length; i += 1) {
  elem[i].addEventListener('click', mouseChangeTool);
}
document.addEventListener('keyup', selectTool);
