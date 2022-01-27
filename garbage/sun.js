/* function using circle generating algo to make sun */
function sun(x,y){
  stroke(255,223,34);
  for(let i = 1; i<=20;i++)
  {
      bres_circle(i,x,y);
  }
}

/* function to place 8 different points according to given parameter for circle */
function placePoints(xc,yc,x,y){
  point(xc+x, yc+y);
  point(xc-x, yc+y);
  point(xc+x, yc-y);
  point(xc-x, yc-y);
  point(xc+y, yc+x);
  point(xc-y, yc+x);
  point(xc+y, yc-x);
  point(xc-y, yc-x);
  
}

function bres_circle(r,xc,yc){
  
  let  d = 3-(2*r);
  let x = 0; /* position of point x */
  let y = r; /* position of point y */
  placePoints(xc, yc, x, y);
  while( y>=x ){
    
    if(d>=0)
    {
      
      d = d + 4*(x-y) + 10;
      x++;
      y--;
    }
    else{
      d = d + 4*x + 6;
      x++;
    }
    placePoints(xc, yc, x, y);
    print(x);
  }
}
