let pixel_size=128;
let mouseIsDown=false;

drawbackground(frame_4x4, false); //default picture

function drawbackground(frame, isImage){
    let canvas=document.getElementById('canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let canvas_length=512; //width and height of canvas for calculate item
    
    if(canvas.getContext){
      var ctx=canvas.getContext('2d');
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
}

function paint(type, frame){
    //pixel_size=4;
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
document.getElementById("canvas").addEventListener('mouseup',()=>mouseIsDown=false);
document.getElementById("canvas").addEventListener('mouseout',()=>mouseIsDown=false);

/*******************MOUSE ACTIONS*******************/
function mousedown(e){
    mouseIsDown=true;
    getAction(e);
}

function mousemove(e){
    if(!mouseIsDown)return;
    getAction(e);
}

/*******************PANEL FUNCTIONS*******************/
function getAction(e){
    switch(panel.activetool){
        case "pencil": return draw(e);
        break;
        case "picker": return getColorWithPicker(e);
        break;
        case "fill": ;
        break;
    }
}

function draw(e){
    //console.log(e);
    let canvas=document.getElementById('canvas');
    let ctx=canvas.getContext('2d');
    ctx.fillStyle=panel.currentColor;
    let x = e.offsetX;
    let y = e.offsetY;
    let row= Math.floor(x/pixel_size);
    let column= Math.floor(y/pixel_size);
    //console.log(row+" "+column);
    console.log(pixel_size);
    ctx.fillRect(row*pixel_size, column*pixel_size, pixel_size, pixel_size);
}

function getColorWithPicker(e){
    
    let canvas=document.getElementById('canvas');
    let ctx=canvas.getContext('2d');
    ctx.fillStyle=panel.currentColor;
    let x = e.offsetX;
    let y = e.offsetY;
    //imgData получает цвет по заданным координатам. Их нужно высчитать.
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
    updateColor(newColor);
    
}