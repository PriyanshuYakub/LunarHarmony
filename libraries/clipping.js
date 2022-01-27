/* Function to draw squares and implement
 * cohen sutherland line clipping to 4 lines at different angles to generate
 * a clipped scene to use as tiles in the project*/
function draw_square(x, y, w, step, a) {
  let xstart = x + 15;
  let ystart = y + 15;

  let slope = tan(a);
  let c = ystart - slope * xstart;

  let downAccept = true;
  let upAccept = true;

  let i = 0;

  while (i < 3) {
      if (i == 0) {
          stroke("#99b898");
      } else if (i == 1) {
          stroke("#fecea8");
      } else if (i == 2) {
          stroke("#ff847c");
      } else {
          stroke("#e84a5f");

      }
      let x1 = x - w / 2;
      let y1 = slope * x1 + c - i * step / cos(a);
      let x2 = x + w + w / 2;
      let y2 = slope * x2 + c - i * step / cos(a);
      line_clipped(x1, y1, x2, y2, x, y, w, w);

      x1 = x - w / 2;
      y1 = slope * x1 + c + i * step / cos(a);
      x2 = x + w + w / 2;
      y2 = slope * x2 + c + i * step / cos(a);
      line_clipped(x1, y1, x2, y2, x, y, w, w);

      i++;
  }
  noFill();
  strokeWeight(4);
  stroke("#2a363b");
  rect(x, y, w, w);
}
/* Function to encode the endpoints */
function encode_endpoint(x, y, clipx, clipy, clipw, cliph) {
  let code = 0; /* Initialized to being inside clip window */

  /* Calculate the min and max coordinates of clip window */
  var xmin = clipx;
  var xmax = clipx + clipw;
  var ymin = clipy;
  var ymax = clipy + clipw;

  if (x < xmin) {
      code |= (1 << 0);
  } else if (x > xmax) {
      code |= (1 << 1);
  }

  if (y < ymin) {
      code |= (1 << 2);
  } else if (y > ymax) {
      code |= (1 << 3);
  }

  return code;
}

function line_clipped(x0, y0, x1, y1, clipx, clipy, clipw, cliph) {

  /* Stores encodings for the two endpoints of our line */
  var e0code, e1code;

  /* Calculate X and Y ranges for our clip window */
  let xmin = clipx;
  let xmax = clipx + clipw;
  let ymin = clipy;
  let ymax = clipy + cliph;

  /* Whether the line should be drawn or not */
  let accept = false;

  do {
      /* Get encodings for the two endpoints of our line */
      e0code = encode_endpoint(x0, y0, clipx, clipy, clipw, cliph);
      e1code = encode_endpoint(x1, y1, clipx, clipy, clipw, cliph);

      if (e0code == 0 && e1code == 0) {
          /* If line inside window, accept and break out of loop */
          accept = true;
          break;
      } else if ((e0code & e1code) != 0) {
          /* If the bitwise AND is not 0, it means both points share
           * an outside zone. Leave accept as 'false' and exit loop.
           */
          break;
      } else {
          /* Pick an endpoint that is outside the clip window */
          let code = e0code != 0 ? e0code : e1code;

          let newx = 0,
              newy = 0;

          /* Now figure out the new endpoint that needs to replace
           * the current one. Each of the four cases are handled
           * separately.
           */
          if ((code & (1 << 0)) != 0) {
              /* Endpoint is to the left of clip window */
              newx = xmin;
              newy = ((y1 - y0) / (x1 - x0)) * (newx - x0) + y0;
          } else if ((code & (1 << 1)) != 0) {
              /* Endpoint is to the right of clip window */
              newx = xmax;
              newy = ((y1 - y0) / (x1 - x0)) * (newx - x0) + y0;
          } else if ((code & (1 << 3)) != 0) {
              /* Endpoint is above the clip window */
              newy = ymax;
              newx = ((x1 - x0) / (y1 - y0)) * (newy - y0) + x0;
          } else if ((code & (1 << 2)) != 0) {
              /* Endpoint is below the clip window */
              newy = ymin;
              newx = ((x1 - x0) / (y1 - y0)) * (newy - y0) + x0;
          }

          /* Now we replace the old endpoint depending on which we chose */
          if (code == e0code) {
              x0 = newx;
              y0 = newy;
          } else {
              x1 = newx;
              y1 = newy;
          }
      }
  } while (true);

  /* Only draw the line if it was not rejected */
  if (accept) {
      line(x0, y0, x1, y1);
  }

  return accept;
}