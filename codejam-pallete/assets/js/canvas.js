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
        case "picker": return getColorWithPicker(e);
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

function getColorWithPicker(e){
    // let canvas=document.getElementById('canvas');
    // let ctx=canvas.getContext('2d');
    // ctx.fillStyle=panel.currentColor;
    let x = e.offsetX;
        let y = e.offsetY;
        let imgData=ctx.getImageData(x, y, x, y);
        let color=imgData.data;
        let newColor="#";
        for (i=0; i<3; i++){
            let hex=(color[i].toString(16));
            if (hex.length==1){
                newColor+="0";
            }
            newColor+=hex;
        }
        updateColor(newColor, mouseFirstAction);
        mouseFirstAction=false;
}
/*******************picker*******************/
/*******************fill bucket*******************/
function fill(){
    ctx.fillStyle=panel.currentColor;
    let size = canvas_length/pixel_size;
    for (let row=0; row<size; row++){
        for (let column=0; column<size; column++){
            ctx.fillRect(row*pixel_size, column*pixel_size, pixel_size, pixel_size);
        }
    }
}
/*******************fill bucket*******************/
