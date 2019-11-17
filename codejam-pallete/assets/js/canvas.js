let canvas_length=512; //default
let pixel_size=128;
let mouseIsDown=false;
let mouseFirstAction=true;
let x0=x1=y0=y1=null;

let canvas=document.getElementById('canvas');
let ctx=canvas.getContext('2d');

drawbackground(frame_4x4, false); //default picture

function drawbackground(frame, isImage){
    // let canvas=document.getElementById('canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    //canvas_length=512; //width and height of canvas for calculate item
    
    if(canvas.getContext){
    //   var ctx=canvas.getContext('2d');
      if (isImage){        
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height); 
      }else{
        pixel_size=canvas_length/frame.length;
        console.log("Pixel size is "+pixel_size);
          frame.forEach((row, i) => {
              row.forEach((column, j)=>{
              if (frame[0][0].length==4){
                  ctx.fillStyle="rgba("+column[0]+","+column[1]+","+column[2]+","+column[3]/255+")";
              }else{
                  ctx.fillStyle="#"+column;
              }
              ctx.fillRect(i*pixel_size, j*pixel_size, pixel_size, pixel_size);
              })
          });
        }
    }
    ctx.fillStyle=panel.currentColor;
}

function paint(type, frame){
    pixel_size=16;
    if (type=="image"){
        var img = new Image();
        img.src = '../codejam-pallete/assets/data/image.png';
        // console.log(img.src);
        img.addEventListener("load", function() {
          drawbackground(img, true);
        });
    }else if(type=="frame"){
        drawbackground(frame, false);
    }
}

/*******************LISTENERS*******************/
document.getElementById("canvas").addEventListener('mousemove', mousemove);
document.getElementById("canvas").addEventListener('mousedown', mousedown);
document.getElementById("canvas").addEventListener('mouseup', clearmouse);
document.getElementById("canvas").addEventListener('mouseout', clearmouse);
document.addEventListener('keyup', selectTool);

/*******************MOUSE ACTIONS*******************/
function mousedown(e){
    mouseIsDown=true;
    // x0 = e.offsetX;
    // y0 = e.offsetY;
    getAction(e);
}

function mousemove(e){
    if(!mouseIsDown)return;
    getAction(e);
}

// function mouseup(){
//     clearmouse();
// }

// function mouseout(){
//     clearmouse();
// }

function clearmouse(){
    mouseIsDown=false;
    x0=null;
    x1=null;
    y0=null;
    y1=null;
    mouseFirstAction=true;
}
/*******************KEYBOARD FUNCTIONS*******************/
function selectTool(e){
    //console.log(e.code);
    switch (e.code){
        case "KeyB": keyboardChangeTool("fill"); //fill bucket
            break;
        case "KeyP": keyboardChangeTool("pencil");//pencil
            break;
        case "KeyC": keyboardChangeTool("picker");//picker
            break;
    }
}
/*******************PANEL FUNCTIONS*******************/
function getAction(e){
    switch(panel.activetool){
        case "pencil": return draw(e);
        break;
        case "picker": return changeColorWithPicker(e);
        break;
        case "fill": return fill(e);
        break;
    }
}

/*******************draw*******************/
function draw(e){
    //console.log(e);
    // let canvas=document.getElementById('canvas');
    // let ctx=canvas.getContext('2d');
    ctx.fillStyle=panel.currentColor;
    //debugger;
    if (x0==null && y0==null){
        x0 = e.offsetX;
        y0 = e.offsetY;    
        let row= Math.floor(x0/pixel_size);
        let column= Math.floor(y0/pixel_size);
        //console.log(x0+" "+y0);
        //console.log(pixel_size);
        ctx.fillRect(row*pixel_size, column*pixel_size, pixel_size, pixel_size);
    }else{
        x1=e.offsetX;
        y1=e.offsetY;
        //console.log(x0+" x0, " + y0 + " y0, " + x1 + " x1, " + y1 + " y1");
        useBresenhams(x0,y0,x1,y1);
    }
}

function useBresenhams(x0, y0, x1, y1){
   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;

   while(true){
     pixel(x0,y0);  // Do what you need to for this

     if ((x0==x1) && (y0==y1)) break;
     var e2 = 2*err;
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }

}

function pixel(x,y){
    // let canvas=document.getElementById('canvas');
    // let ctx=canvas.getContext('2d');
    // ctx.fillStyle=panel.currentColor;
    let row= Math.floor(x/pixel_size);
    let column= Math.floor(y/pixel_size);
    ctx.fillRect(row*pixel_size, column*pixel_size, pixel_size, pixel_size);
    x0=x1;
    y0=y1;
}
/*******************draw*******************/
/*******************picker*******************/
function changeColorWithPicker(e){
    let newColor=getColorWithPicker(e);
    updateColor(colorToHex(newColor), mouseFirstAction);
    mouseFirstAction=false;
}

function getColorWithPicker(e){
    // let canvas=document.getElementById('canvas');
    // let ctx=canvas.getContext('2d');
    // ctx.fillStyle=panel.currentColor;
    let x = e.offsetX;
    let y = e.offsetY;
    let imgData=ctx.getImageData(x, y, x, y);
    let color=imgData.data;
    return color;
}

function colorToHex(color){
    let newColor="#";
    for (i=0; i<3; i++){
        let hex=(color[i].toString(16));
        if (hex.length==1){
            newColor+="0";
        }
        newColor+=hex;
    }
    return newColor;
}

/*******************picker*******************/
/*******************fill bucket*******************/
function fill(e){
    // ctx.fillStyle=panel.currentColor;
    // let size = canvas_length/pixel_size;
    // for (let row=0; row<size; row++){
    //     for (let column=0; column<size; column++){
    //         ctx.fillRect(row*pixel_size, column*pixel_size, pixel_size, pixel_size);
    //     }
    // }
    let filler=new CanvasFloodFiller();
    let rgbaColor=getCurrentColorObj(panel.currentColor);//rgba obj
    //console.log(color)
    //console.log(rgbaColor);
    filler.floodFill(ctx, e.offsetX, e.offsetY, rgbaColor);

}

function getCurrentColorObj(color){
    return{
        r: parseInt(color.slice(1, 3), 16),
        g: parseInt(color.slice(3, 5), 16),
        b: parseInt(color.slice(5, 7), 16),
        a: 255
    }
}

// filler

function CanvasFloodFiller()
{
    // Ширина и высота канвы
    var _cWidth = -1;
    var _cHeight = -1;
 
    // Заменяемый цвет
    var _rR = 0;
    var _rG = 0;
    var _rB = 0;
    var _rA = 0;
 
    // Цвет закраски
    var _nR = 0;
    var _nG = 0;
    var _nB = 0;
    var _nA = 0;
 
    var _data = null;
 
    /*
     * Получить точку из данных
     **/
    var getDot = function(x, y)
    {
        // Точка: y * ширину_канвы * 4 + (x * 4)
        var dstart = (y * _cWidth * 4) + (x * 4);
        var dr = _data[dstart];
        var dg = _data[dstart + 1];
        var db = _data[dstart + 2];
        var da = _data[dstart + 3];
 
        return {r: dr, g: dg, b: db, a: da};
    }
 
    /*
     * Пиксель по координатам x,y - готовый к заливке?
     **/
    var isNeededPixel = function(x, y)
    {
        var dstart = (y * _cWidth * 4) + (x * 4);
        var dr = _data[dstart];
        var dg = _data[dstart + 1];
        var db = _data[dstart + 2];
        var da = _data[dstart + 3];
 
        return (dr == _rR && dg == _rG && db == _rB && da == _rA);
    }
 
    /*
     * Найти левый пиксель, по пути закрашивая все попавшиеся
     **/
    var findLeftPixel = function(x, y)
    {
        // Крутим пикселы влево, заодно красим. Возвращаем левую границу.
        // Во избежание дубляжа и ошибок, findLeftPixel НЕ красит текущий
        // пиксел! Это сделает обязательный поиск вправо.
        var lx = x - 1;
        var dCoord = (y * _cWidth * 4) + (lx * 4);
 
        while (lx >= 0 && _data[dCoord] == _rR && _data[dCoord + 1] == _rG &&
            _data[dCoord + 2] == _rB && _data[dCoord + 3] == _rA)
        {
            _data[dCoord] = _nR;
            _data[dCoord + 1] = _nG;
            _data[dCoord + 2] = _nB;
            _data[dCoord + 3] = _nA;
 
            lx--;
            dCoord -= 4;
        }
 
        return lx + 1;
    }
 
    /*
     * Найти правый пиксель, по пути закрашивая все попавшиеся
     **/
    var findRightPixel = function(x, y)
    {
        var rx = x;
        var dCoord = (y * _cWidth * 4) + (x * 4);
 
        while (rx < _cWidth && _data[dCoord] == _rR && _data[dCoord + 1] == _rG &&
            _data[dCoord + 2] == _rB && _data[dCoord + 3] == _rA)
        {
            _data[dCoord] = _nR;
            _data[dCoord + 1] = _nG;
            _data[dCoord + 2] = _nB;
            _data[dCoord + 3] = _nA;
 
            rx++;
            dCoord += 4;
        }
 
        return rx - 1;
    }
 
    /*
     * Эффективная (строчная) заливка
     **/
    var effectiveFill = function(cx, cy)
    {
        var lineQueue = new Array();
 
        var fx1 = findLeftPixel(cx, cy);
        var fx2 = findRightPixel(cx, cy);
 
        lineQueue.push({x1: fx1, x2: fx2, y: cy});
 
        while (lineQueue.length > 0)
        {
            var cLine = lineQueue.shift();
            var nx1 = cLine.x1;
            var nx2 = cLine.x1;
            var currx = nx2;
 
            // Сперва для первого пиксела, если верхний над ним цвет подходит,
            // пускаем поиск левой границы.
            // Можно искать вверх?
            if (cLine.y > 0)
            {
                // Сверху строка может идти левее текущей?
                if (isNeededPixel(cLine.x1, cLine.y - 1))
                {
                    // Ищем в том числе влево
                    nx1 = findLeftPixel(cLine.x1, cLine.y - 1);
                    nx2 = findRightPixel(cLine.x1, cLine.y - 1);
                    lineQueue.push({x1: nx1, x2: nx2, y: cLine.y - 1});
                }
 
                currx = nx2;
                // Добираем недостающее, ищем только вправо, но пока не
                // доползли так или иначе далее края текущей строки
                while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (_cWidth - 1))
                {
                    currx++;
 
                    if (isNeededPixel(currx, cLine.y - 1))
                    {
                        // Сохраняем найденный отрезок
                        nx1 = currx;
                        nx2 = findRightPixel(currx, cLine.y - 1);
                        lineQueue.push({x1: nx1, x2: nx2, y: cLine.y - 1});
                        // Прыгаем далее найденного
                        currx = nx2;
                    }
                }
            }
 
            nx1 = cLine.x1;
            nx2 = cLine.x1;
            // Те же яйца, но можно ли искать вниз?
            if (cLine.y < (_cHeight - 1))
            {
                // Снизу строка может идти левее текущей?
                if (isNeededPixel(cLine.x1, cLine.y + 1))
                {
                    // Ищем в том числе влево
                    nx1 = findLeftPixel(cLine.x1, cLine.y + 1);
                    nx2 = findRightPixel(cLine.x1, cLine.y + 1);
                    lineQueue.push({x1: nx1, x2: nx2, y: cLine.y + 1});
                }
 
                currx = nx2;
                // Добираем недостающее, ищем только вправо, но пока не
                // доползли так или иначе далее края текущей строки
                while (cLine.x2 >= nx2 && currx <= cLine.x2 && currx < (_cWidth - 1))
                {
                    currx++;
 
                    if (isNeededPixel(currx, cLine.y + 1))
                    {
                        // Сохраняем найденный отрезок
                        nx1 = currx;
                        nx2 = findRightPixel(currx, cLine.y + 1);
                        lineQueue.push({x1: nx1, x2: nx2, y: cLine.y + 1});
                        // Прыгаем далее найденного
                        currx = nx2;
                    }
                }
            }
 
        }   // while (main loop)
    }
 
    /*
     * void floodFill(CanvasContext2D canvasContext, int x, int y)
     * Выполняет заливку на канве
     * canvasContext - контекст
     * int x, y - координаты точки заливки
     * color - цвет заливки
     */
    this.floodFill = function(canvasContext, x, y, color)
    {
        _cWidth = canvasContext.canvas.width;
        _cHeight = canvasContext.canvas.height;
        //debugger;
        _nR = color.r;
        _nG = color.g;
        _nB = color.b;
        _nA = color.a;
 
        var idata = canvasContext.getImageData(0, 0, _cWidth, _cHeight);
        var pixels = idata.data;
        _data = pixels;
 
        var toReplace = getDot(x, y);
        _rR = toReplace.r;
        _rG = toReplace.g;
        _rB = toReplace.b;
        _rA = toReplace.a;
 
        // Всё зависнет, если цвета совпадают
        if (_rR == _nR && _rG == _nG && _rB == _nB && _rA == _nA){
            return;
        }
 
        effectiveFill(x, y);
 
        canvasContext.putImageData(idata, 0, 0);
    }
}
/*******************fill bucket*******************/
