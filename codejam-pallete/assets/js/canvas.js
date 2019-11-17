const canvasLength = 512; // default
let pixelSize = 128;
let mouseIsDown = false;
let mouseFirstAction = true;
let x0 = null;
let x1 = null;
let y0 = null;
let y1 = null;
let canvasSize; // 4x4, 16x16 - single number
const sizes = [4, 8, 16, 32, 64, 128, 256, 512];


window.onbeforeunload = function () {
  localStorage.setItem('canvasImage', this.canvas.toDataURL());
  localStorage.setItem('canvasSize', canvasSize);
};


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function clearCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // localStorage.removeItem("canvasImage");
}
clearCanvas();

// getSize
canvasSize = localStorage.getItem('canvasSize');
if (canvasSize === null) {
  canvasSize = 4;
}

// get image from localStorage
if (localStorage.getItem('canvasImage')) {
  const dataURL = localStorage.getItem('canvasImage');
  const img = new Image();
  img.src = dataURL;
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
}

function activeSize() {
  for (let i = 0; i < sizes.length; i += 1) {
    if (sizes[i] - canvasSize === 0) {
      document.getElementsByClassName('panel_item_size')[i].classList.add('active');
    } else {
      document.getElementsByClassName('panel_item_size')[i].classList.remove('active');
    }
  }
}

function setCanvas(size) {
  console.log(size);
  canvasSize = size;
  pixelSize = canvasLength / canvasSize;

  activeSize();
}

setCanvas(canvasSize);


// function mouseup(){
//     clearmouse();
// }

// function mouseout(){
//     clearmouse();
// }

function clearmouse() {
  mouseIsDown = false;
  x0 = null;
  x1 = null;
  y0 = null;
  y1 = null;
  mouseFirstAction = true;
  // if (panel.activeTool==="paint"){
  //     localStorage.setItem(canvasName, canvas.toDataURL());
  // }
}

/** *****************draw****************** */
function pixel(x, y) {
  // let canvas=document.getElementById('canvas');
  // let ctx=canvas.getContext('2d');
  // ctx.fillStyle=panel.currentColor;
  const row = Math.floor(x / pixelSize);
  const column = Math.floor(y / pixelSize);
  ctx.fillRect(row * pixelSize, column * pixelSize, pixelSize, pixelSize);
  x0 = x1;
  y0 = y1;
}

function useBresenhams(ox0, oy0, ox1, oy1) {
  const dx = Math.abs(ox1 - ox0);
  const dy = Math.abs(oy1 - oy0);
  const sx = (ox0 < ox1) ? 1 : -1;
  const sy = (oy0 < oy1) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    pixel(ox0, oy0); // Do what you need to for this

    if ((ox0 === ox1) && (oy0 === oy1)) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; ox0 += sx; }
    if (e2 < dx) { err += dx; oy0 += sy; }
  }
}

function draw(e) {
  // console.log(e);
  // let canvas=document.getElementById('canvas');
  // let ctx=canvas.getContext('2d');
  ctx.fillStyle = panel.currentColor;
  // debugger;
  if (x0 === null && y0 === null) {
    x0 = e.offsetX;
    y0 = e.offsetY;
    const row = Math.floor(x0 / pixelSize);
    const column = Math.floor(y0 / pixelSize);
    // console.log(x0+" "+y0);
    // console.log(pixelSize);
    ctx.fillRect(row * pixelSize, column * pixelSize, pixelSize, pixelSize);
  } else {
    x1 = e.offsetX;
    y1 = e.offsetY;
    // console.log(x0+" x0, " + y0 + " y0, " + x1 + " x1, " + y1 + " y1");
    useBresenhams(x0, y0, x1, y1);
  }
}

/** *****************draw****************** */
/** *****************picker****************** */

function getColorWithPicker(e) {
  // let canvas=document.getElementById('canvas');
  // let ctx=canvas.getContext('2d');
  // ctx.fillStyle=panel.currentColor;
  const x = e.offsetX;
  const y = e.offsetY;
  const imgData = ctx.getImageData(x, y, x, y);
  const color = imgData.data;
  return color;
}

function colorToHex(color) {
  let newColor = '#';
  for (let i = 0; i < 3; i += 1) {
    const hex = (color[i].toString(16));
    if (hex.length === 1) {
      newColor += '0';
    }
    newColor += hex;
  }
  return newColor;
}

function changeColorWithPicker(e) {
  const newColor = getColorWithPicker(e);
  updateColor(colorToHex(newColor), mouseFirstAction);
  mouseFirstAction = false;
}

/** *****************picker****************** */
/** *****************fill bucket****************** */
function fill(e) {
  // ctx.fillStyle=panel.currentColor;
  // let size = canvasLength/pixelSize;
  // for (let row=0; row<size; row++){
  //     for (let column=0; column<size; column++){
  //         ctx.fillRect(row*pixelSize, column*pixelSize, pixelSize, pixelSize);
  //     }
  // }

  // filler

  function CanvasFloodFiller() {
  // Ширина и высота канвы
    let cWidth = -1;
    let cHeight = -1;

    // Заменяемый цвет
    let rR = 0;
    let rG = 0;
    let rB = 0;
    let rA = 0;

    // Цвет закраски
    let nR = 0;
    let nG = 0;
    let nB = 0;
    let nA = 0;

    let data = null;

    /*
     * Получить точку из данных
     * */
    const getDot = function (x, y) {
    // Точка: y * ширину_канвы * 4 + (x * 4)
      const dstart = (y * cWidth * 4) + (x * 4);
      const dr = data[dstart];
      const dg = data[dstart + 1];
      const db = data[dstart + 2];
      const da = data[dstart + 3];

      return {
        r: dr, g: dg, b: db, a: da,
      };
    };

    /*
     * Пиксель по координатам x,y - готовый к заливке?
     * */
    const isNeededPixel = function (x, y) {
      const dstart = (y * cWidth * 4) + (x * 4);
      const dr = data[dstart];
      const dg = data[dstart + 1];
      const db = data[dstart + 2];
      const da = data[dstart + 3];

      return (dr === rR && dg === rG && db === rB && da === rA);
    };

    /*
     * Найти левый пиксель, по пути закрашивая все попавшиеся
     * */
    const findLeftPixel = function (x, y) {
    // Крутим пикселы влево, заодно красим. Возвращаем левую границу.
    // Во избежание дубляжа и ошибок, findLeftPixel НЕ красит текущий
    // пиксел! Это сделает обязательный поиск вправо.
      let lx = x - 1;
      let dCoord = (y * cWidth * 4) + (lx * 4);

      while (lx >= 0 && data[dCoord] === rR && data[dCoord + 1] === rG
            && data[dCoord + 2] === rB && data[dCoord + 3] === rA) {
        data[dCoord] = nR;
        data[dCoord + 1] = nG;
        data[dCoord + 2] = nB;
        data[dCoord + 3] = nA;

        lx -= 1;
        dCoord -= 4;
      }

      return lx + 1;
    };

    /*
     * Найти правый пиксель, по пути закрашивая все попавшиеся
     * */
    const findRightPixel = function (x, y) {
      let rx = x;
      let dCoord = (y * cWidth * 4) + (x * 4);

      while (rx < cWidth && data[dCoord] === rR && data[dCoord + 1] === rG
            && data[dCoord + 2] === rB && data[dCoord + 3] === rA) {
        data[dCoord] = nR;
        data[dCoord + 1] = nG;
        data[dCoord + 2] = nB;
        data[dCoord + 3] = nA;

        rx += 1;
        dCoord += 4;
      }

      return rx - 1;
    };

    /*
     * Эффективная (строчная) заливка
     * */
    const effectiveFill = function (cx, cy) {
      const lineQueue = [];

      const fx1 = findLeftPixel(cx, cy);
      const fx2 = findRightPixel(cx, cy);

      lineQueue.push({ x1: fx1, x2: fx2, y: cy });

      while (lineQueue.length > 0) {
        const cLine = lineQueue.shift();
        let nx1 = cLine.x1;
        let nx2 = cLine.x1;
        let currx = nx2;

        // Сперва для первого пиксела, если верхний над ним цвет подходит,
        // пускаем поиск левой границы.
        // Можно искать вверх?
        if (cLine.y > 0) {
        // Сверху строка может идти левее текущей?
          if (isNeededPixel(cLine.x1, cLine.y - 1)) {
          // Ищем в том числе влево
            nx1 = findLeftPixel(cLine.x1, cLine.y - 1);
            nx2 = findRightPixel(cLine.x1, cLine.y - 1);
            lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y - 1 });
          }

          currx = nx2;
          // Добираем недостающее, ищем только вправо, но пока не
          // доползли так или иначе далее края текущей строки
          while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (cWidth - 1)) {
            currx += 1;

            if (isNeededPixel(currx, cLine.y - 1)) {
            // Сохраняем найденный отрезок
              nx1 = currx;
              nx2 = findRightPixel(currx, cLine.y - 1);
              lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y - 1 });
              // Прыгаем далее найденного
              currx = nx2;
            }
          }
        }

        nx1 = cLine.x1;
        nx2 = cLine.x1;
        // Мо можно ли искать вниз?
        if (cLine.y < (cHeight - 1)) {
        // Снизу строка может идти левее текущей?
          if (isNeededPixel(cLine.x1, cLine.y + 1)) {
          // Ищем в том числе влево
            nx1 = findLeftPixel(cLine.x1, cLine.y + 1);
            nx2 = findRightPixel(cLine.x1, cLine.y + 1);
            lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y + 1 });
          }

          currx = nx2;
          // Добираем недостающее, ищем только вправо, но пока не
          // доползли так или иначе далее края текущей строки
          while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (cWidth - 1)) {
            currx += 1;

            if (isNeededPixel(currx, cLine.y + 1)) {
            // Сохраняем найденный отрезок
              nx1 = currx;
              nx2 = findRightPixel(currx, cLine.y + 1);
              lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y + 1 });
              // Прыгаем далее найденного
              currx = nx2;
            }
          }
        }
      } // while (main loop)
    };

    /*
     * void floodFill(CanvasContext2D canvasContext, int x, int y)
     * Выполняет заливку на канве
     * canvasContext - контекст
     * int x, y - координаты точки заливки
     * color - цвет заливки
     */
    this.floodFill = function (canvasContext, x, y, color) {
      cWidth = canvasContext.canvas.width;
      cHeight = canvasContext.canvas.height;
      // debugger;
      nR = color.r;
      nG = color.g;
      nB = color.b;
      nA = color.a;

      const idata = canvasContext.getImageData(0, 0, cWidth, cHeight);
      const pixels = idata.data;
      data = pixels;

      const toReplace = getDot(x, y);
      rR = toReplace.r;
      rG = toReplace.g;
      rB = toReplace.b;
      rA = toReplace.a;

      // Всё зависнет, если цвета совпадают
      if (rR === nR && rG === nG && rB === nB && rA === nA) {
        return;
      }

      effectiveFill(x, y);

      canvasContext.putImageData(idata, 0, 0);
    };
  }

  function getCurrentColorObj(color) {
    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16),
      a: 255,
    };
  }

  const filler = new CanvasFloodFiller();
  const rgbaColor = getCurrentColorObj(panel.currentColor);// rgba obj
  // console.log(color)
  // console.log(rgbaColor);
  filler.floodFill(ctx, e.offsetX, e.offsetY, rgbaColor);
}

/** *****************fill bucket****************** */

/** *****************PANEL FUNCTIONS****************** */
function getAction(e) {
  switch (panel.activeTool) {
    case 'pencil': return draw(e);
    case 'picker': return changeColorWithPicker(e);
    case 'fill': return fill(e);
    default: break;
  }
  return true;
}

/** *****************MOUSE ACTIONS****************** */
function mousedown(e) {
  mouseIsDown = true;
  // x0 = e.offsetX;
  // y0 = e.offsetY;
  getAction(e);
}

function mousemove(e) {
  if (!mouseIsDown) return;
  getAction(e);
}
/** *****************MOUSE ACTIONS****************** */

/** *****************LISTENERS****************** */
document.getElementById('canvas').addEventListener('mousemove', mousemove);
document.getElementById('canvas').addEventListener('mousedown', mousedown);
document.getElementById('canvas').addEventListener('mouseup', clearmouse);
document.getElementById('canvas').addEventListener('mouseout', clearmouse);
