/*declaration of parameters */
let mode = 0; /* mode to govern welcome or animation scene */
let field = [];
let rez = 20;
let cols, rows;
let increment = 0.1;
let zoff = 0;
let noise;


let count = 0;
let a = -06; //angle governing moon phase
var bg_color;
let tile = 40;

/*parameeters governing the position and opacity of the moon*/
let moon_x = 1000;
let moon_y = 400;
let moon_opacity = 0;
let moon_color;

/*parameeters governing the position and opacity of the sun*/
let sun_x = 880;
let sun_y = 200;
let sun_opacity = 255;

/* Parameters governing sky for day night transition */
let sky_day;
let sky_night;
let sky_opacity = 0;
let time_counter = 40;
let day_count = 1; /* counter to keep track of days */
let day = true;
let night = false;

/* Night mask to create shadow effect for objects */
let night_mask;

/* setup function */
function setup() {
    createCanvas(1080, 720, P2D);

    /* parameters and OpenSimplexNoise for marching squares algorithm */
    noise = new OpenSimplexNoise(Date.now());
    cols = 1 + width / rez;
    rows = 1 + height / rez;
    for (let i = 0; i < cols; i++) {
        let k = [];
        for (let j = 0; j < rows; j++) {
            k.push(0);
        }
        field.push(k);
    }

}


function draw() {

    frameRate(23);
    bg_color = get(800, 400);

    /* Welcome scene created using Marching squares algorithm */
    if (mode == 0) {
        background(0);
        let xoff = 0;
        for (let i = 0; i < cols; i++) {
            xoff += increment;
            let yoff = 0;
            for (let j = 0; j < rows; j++) {
                field[i][j] = float(noise.noise3D(xoff, yoff, zoff));
                yoff += increment;
            }
        }
        zoff += 0.01;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                stroke(field[i][j] * 255, field[i][j] * 255, field[i][j] * 255);
                strokeWeight(rez * 0.4);
                point(i * rez, j * rez);
            }
        }

        for (let h = -1; h < 1; h += 0.2) {
            stroke(255, 255 * +h, 127 * h);
            strokeWeight(3);




            for (let i = 0; i < cols - 1; i++) {
                for (let j = 0; j < rows - 1; j++) {
                    let f0 = field[i][j] - h;
                    let f1 = field[i + 1][j] - h;
                    let f2 = field[i + 1][j + 1] - h;
                    let f3 = field[i][j + 1] - h;

                    let x = i * rez;
                    let y = j * rez;
                    let a = createVector(x + rez * f0 / (f0 - f1), y);
                    let b = createVector(x + rez, y + rez * f1 / (f1 - f2));
                    let c = createVector(x + rez * (1 - f2 / (f2 - f3)), y + rez);
                    let d = createVector(x, y + rez * (1 - f3 / (f3 - f0)));

                    let state = getState(f0, f1, f2, f3);
                    switch (state) {
                        case 1:
                            drawLine(c, d);
                            break;
                        case 2:
                            drawLine(b, c);
                            break;
                        case 3:
                            drawLine(b, d);
                            break;
                        case 4:
                            drawLine(a, b);
                            break;
                        case 5:
                            drawLine(a, d);
                            drawLine(b, c);
                            break;
                        case 6:
                            drawLine(a, c);
                            break;
                        case 7:
                            drawLine(a, d);
                            break;
                        case 8:
                            drawLine(a, d);
                            break;
                        case 9:
                            drawLine(a, c);
                            break;
                        case 10:
                            drawLine(a, b);
                            drawLine(c, d);
                            break;
                        case 11:
                            drawLine(a, b);
                            break;
                        case 12:
                            drawLine(b, d);
                            break;
                        case 13:
                            drawLine(b, c);
                            break;
                        case 14:
                            drawLine(c, d);
                            break;
                    }
                }
            }
        }
        strokeWeight(7);
        stroke(255);

        fill("#8c43ab");
        textSize(32);
        textStyle(BOLD);
        textFont('Helvetica');
        textAlign(CENTER);
        text('Welcome Please press a key to Begin', 516, 360);
    }

    /*moon phase animation sequence */
    if (mode > 0) {
        background(255);
        sky_day = color(99, 199, 221, 255 - sky_opacity);
        sky_night = color(1, 20, 32, sky_opacity);

        /* Scene creation */
        print(day_count);
        fill(sky_night);
        rect(80, 80, 920, 560);
        stars(moon_opacity);
        moon(moon_x, moon_y);
        fill(sky_day);
        rect(80, 80, 920, 560);
        sun(sun_x, sun_y, sun_opacity);

        //landscape
        night_mask = map(sun_opacity, 0, 100, 150, 0)
        noStroke();
        fill('#1a5d1f');
        rect(2 * tile, 14 * tile, 23 * tile, 2 * tile);

        //road
        fill(5);
        beginShape();
        vertex(2 * tile, 16 * tile);
        vertex(10 * tile, 14 * tile);
        vertex(12 * tile, 14 * tile);
        vertex(9 * tile, 16 * tile);
        endShape(CLOSE);
        stroke(255);
        dda_line(6 * tile + 10, 16 * tile - 15, 8 * tile, 15 * tile);
        dda_line(9 * tile + 12, 15 * tile - 18, 11 * tile - 20, 14 * tile + 5);
        noStroke();

        //mountain
        fill('#8c6d62');
        triangle(2 * tile, 14 * tile, 12 * tile, 14 * tile, 7 * tile, 6 * tile);
        fill('#6c4b40');
        triangle(2 * tile, 14 * tile, 4 * tile, 14 * tile, 7 * tile, 6 * tile);
        fill('#fff');
        beginShape();
        vertex(6 * tile - 10, 8 * tile);
        vertex(7 * tile, 6 * tile);
        vertex(8 * tile + 17, 8 * tile + 10);
        vertex(7 * tile + 5, 8 * tile - 7);
        vertex(6 * tile - 5, 9 * tile);
        endShape(CLOSE);

        //trees
        var tree1x = 350;
        fill('#4d332d');
        rect(tree1x + 0, 600 - 37, 4, 10, 2);
        fill('#228B22');
        ellipse(tree1x + 3, 600 - 60, 30, 50);
        fill('#00A36C');
        arc(tree1x + 2.5, 600 - 60, 30, 50, -HALF_PI, HALF_PI);

        var tree2x = 180;
        fill('#4d332d');
        rect(tree2x + 0, 600 + 5, 4, 10, 2);
        fill('#228B22');
        ellipse(tree2x + 3, 600 - 20, 30, 50);
        fill('#00A36C');
        arc(tree2x + 2.5, 600 - 20, 30, 50, -HALF_PI, HALF_PI);

        var tree3x = 260;
        fill('#4d332d');
        rect(tree3x + 0, 600 - 20, 4, 10, 2);
        fill('#228B22');
        ellipse(tree3x + 3, 600 - 40, 30, 50);
        fill('#00A36C');
        arc(tree3x + 2.5, 600 - 40, 30, 50, -HALF_PI, HALF_PI);


        var tree4x = 500;
        fill('#4d332d');
        rect(tree4x + 0, 600 + 10, 4, 10, 2);
        fill('#228B22');
        ellipse(tree4x + 3, 600 - 15, 30, 50);
        fill('#00A36C');
        arc(tree4x + 2.5, 600 - 15, 30, 50, -HALF_PI, HALF_PI);

        var tree5x = 600;
        fill('#4d332d');
        rect(tree5x + 0, 600 + 15, 4, 10, 2);
        fill('#228B22');
        ellipse(tree5x + 3, 600 - 10, 30, 50);
        fill('#00A36C');
        arc(tree5x + 2.5, 600 - 10, 30, 50, -HALF_PI, HALF_PI);

        //night mask to give shadow effect
        noStroke();
        fill(0, 0, 0, night_mask);
        rect(2 * tile, 14 * tile, 23 * tile, 2 * tile);
        triangle(2 * tile, 14 * tile, 12 * tile, 14 * tile, 7 * tile, 6 * tile);

        //Conditions to control transition of day and night
        if (day_count <= 30) {
            if (night) {
                if (time_counter == 0) {
                    sun_x -= 5;
                    sun_y -= 5;
                    moon_opacity += 20;
                    sun_opacity -= 5;
                    if (moon_y != -50) {
                        moon_x -= 3;
                        moon_y -= 3;
                    }

                    if (sky_opacity < 255) {
                        sky_opacity += 5;
                    } else {
                        day = true;
                        night = false;
                        time_counter = 40;
                        day_count += 1;
                        sun_x = 1000;
                        sun_y = 400;
                    }
                } else {
                    time_counter -= 1;
                }

            }
            if (day) {
                if (time_counter == 0) {
                    moon_x -= 5;
                    moon_y -= 5;
                    moon_opacity -= 1;
                    sun_opacity += 5;
                    if (sky_opacity > 0) {
                        sky_opacity -= 5;
                    } else {

                        moon_x = 1000;
                        moon_y = 400;
                        day = false;
                        night = true;
                        time_counter = 40;
                    }
                    if (sun_y != -50) {
                        sun_x -= 3;
                        sun_y -= 3;
                    }
                } else {
                    time_counter -= 1;


                }


            }
        }

        //function to create frame to set scene in using squares and 
        //cohen sutherland algorithm.
        frame();
    }

}

/* Function to change scene from welcome to animation sequenxe */
function keyReleased() {

    mode += 1;
}


/* frame creation using cohen sutherland */
function frame() {
    fill(255);

    noStroke();

    // actual frame
    rect(0, 0, 1080, tile * 2);
    rect(0, height - tile * 2, 1080, tile * 2);
    rect(0, tile * 2, tile * 2, tile * 14);
    rect(width - tile * 2, tile * 2, tile * 2, tile * 14);

    noFill();

    //tile or pattern generation
    //bottom
    for (let i = 0; i < 27; i++) {
        rect(i * 40, 640, tile, tile);
        draw_square(i * 40, 640, tile, 10, (i + i * i) % 90);
    }
    for (let i = 0; i < 27; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(i * 40, 640, tile, tile);
    }

    for (let i = 0; i < 27; i++) {
        rect(i * 40, 640, tile, tile);
        draw_square(i * 40, 640 + 40, tile, 10, (i + i * i + 10) % 90);
    }
    for (let i = 0; i < 27; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(i * 40, 640 + 40, tile, tile);
    }

    //Side Left
    for (let i = 0; i < 14; i++) {
        rect(0, 80 + i * tile, tile, tile);
        draw_square(0, 80 + i * tile, tile, 10, (i + i * 15) % 90);
    }
    for (let i = 0; i < 14; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(0, 80 + i * tile, tile, tile);
    }
    for (let i = 0; i < 14; i++) {
        rect(0 + tile, 80 + i * tile, tile, tile);
        draw_square(0 + tile, 80 + i * tile, tile, 10, (i + i * 15) % 90);
    }
    for (let i = 0; i < 14; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(0 + tile, 80 + i * tile, tile, tile);
    }

    //TOP
    for (let i = 0; i < 27; i++) {
        rect(i * 40, 0, tile, tile);
        draw_square(i * tile, 0, tile, 10, (i - i * i) % 90);
    }
    for (let i = 0; i < 27; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(i * tile, 0, tile, tile);
    }

    for (let i = 0; i < 27; i++) {
        rect(i * 40, tile, tile, tile);
        draw_square(i * tile, tile, tile, 10, (i - i * i - 10) % 90);
    }
    for (let i = 0; i < 27; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(i * tile, tile, tile, tile);
    }
    //Side Left
    for (let i = 0; i < 14; i++) {
        rect(width - tile, 80 + i * tile, tile, tile);
        draw_square(width - tile, 80 + i * tile, tile, 10, -(i + i * 15) % 90);
    }
    for (let i = 0; i < 14; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(width - tile * 2, 80 + i * tile, tile, tile);
    }
    for (let i = 0; i < 14; i++) {
        rect(width - tile * 2, 80 + i * tile, tile, tile);
        draw_square(width - tile * 2, 80 + i * tile, tile, 10, -(i + i * 15) % 90);
    }
    for (let i = 0; i < 14; i++) {
        noFill();
        strokeWeight(4);
        stroke("#2a363b");
        rect(width - tile * 2, 80 + i * tile, tile, tile);
    }



}



/* moon function to create moon that 
 * goes through transitions which have a period of i month
 */
function moon(x, y) {
    // moon pahases
    let light_color = color(255, 255, 75, moon_opacity);

    //switch statement fro 30 days assigning angle for each moon phase
    // starting from crescent and ending at new moon
    if (night) {
        switch (day_count) {
            case 1:
                a = -2.80318530717959;
                break;
            case 2:
                a = -2.51318530717959;
                break;
            case 3:
                a = -2.21318530717959;
                break;
            case 4:
                a = -2.01318530717959;
                break;
            case 5:
                a = -1.80318530717959;
                break;
            case 6:
                a = -1.66318530717959;
                break;
            case 7:
                a = -1.56318530717959;
                break;
            case 8:
                a = -1.37318530717959;
                break;
            case 9:
                a = -1.10318530717959;
                break;
            case 10:
                a = -0.803185307179586;
                break;
            case 11:
                a = -0.67318530717959;
                break;
            case 12:
                a = -0.37318530717959;
                break;
            case 13:
                a = -0.20318530717959;
                break;
            case 14:
                a = -0.003185307179586;
                break;
            case 15:
                a = -0.003185307179586;
                break;
            case 16:
                a = -6.15318530717959;
                break;
            case 17:
                a = -5.803185307179586;
                break;
            case 18:
                a = -5.47318530717959;
                break;
            case 19:
                a = -5.17318530717959;
                break;
            case 20:
                a = -4.90318530717959;
                break;
            case 21:
                a = -4.78318530717959;
                break;
            case 22:
                a = -4.68318530717959;
                break;
            case 23:
                a = -4.47318530717959;
                break;
            case 24:
                a = -4.20318530717959;
                break;
            case 25:
                a = -4.003185307179586;
                break;
            case 26:
                a = -3.97318530717959;
                break;
            case 27:
                a = -3.77318530717959;
                break;
            case 28:
                a = -3.50318530717959;
                break;
            case 29:
                a = -3.43318530717959;
                break;
            case 30:
                a = -3.17318530717959;
                break;
            default:
                a = -0.003185307179586;
                //  
        }
    }

    noStroke();

    //centre of moon and diameter
    let phasex = x;
    let phasey = y;
    let d2 = 100;

    line(phasex, 0, phasex, height);

    let color1 = color(0, 25, 25, 0); //red
    let color2 = color(0, 25, 25, 0); //gray
    let color3 = color(0, 25, 25, 0); //blue
    let color4 = color(0, 25, 25, 0); //green

    //assigning colors according to the angle for 4 arcs
    if (-Math.PI / 2 < a && a < 0) {
        color3 = light_color;
        color4 = light_color;
        color1 = light_color;
        color2 = bg_color;
    } else if (-Math.PI < a && a < -Math.PI / 2) {
        color1 = light_color;
        color3 = bg_color;
        color4 = bg_color;
        color2 = bg_color;
    } else if (-3 * Math.PI / 2 < a && a < -Math.PI) {
        color4 = bg_color;
        color2 = light_color;
        color1 = bg_color;
        color3 = bg_color;
    } else if (-2 * Math.PI < a && a < -3 * Math.PI / 2) {
        color4 = color(0, 255, 0, 0);
        color3 = light_color;
        color1 = bg_color;
        color2 = light_color;
    }

    //using arcs to create a bright part of moon
    // using light color and shadow part of moon using
    // bg_color
    fill(color1);
    arc(phasex, phasey, d2, d2, PI / 2, 3 * PI / 2);
    fill(color2);
    arc(phasex, phasey, d2, d2, 3 * PI / 2, PI / 2);

    let heightPhase = d2;
    let widthPhase = map(Math.cos(a), 0, 1, 0, d2);

    fill(color3);
    arc(phasex, phasey, widthPhase - 2, heightPhase + 1, PI / 2, 3 * PI / 2);
    fill(color4);
    arc(phasex, phasey, widthPhase - 2, heightPhase + 1, 3 * PI / 2, PI / 2);
}

//drawline and bnary state functions for marching square
function drawLine(v1, v2) {
    line(v1.x, v1.y, v2.x, v2.y);
}
//get state method to get binary value which is one of 16 (binary: 0-15) states
function getState(a, b, c, d) {
    return (a > 0 ? 8 : 0) + (b > 0 ? 4 : 0) + (c > 0 ? 2 : 0) + (d > 0 ? 1 : 0);
}




/* function using circle generating algo to make sun */
function sun(x, y, opacity) {
    stroke(255, 223, 34, opacity);
    for (let i = 1; i <= 40; i++) {
        bres_circle(i, x, y);
    }
}

/* function to place 8 different points according to given parameter for circle */
function placePoints(xc, yc, x, y) {
    point(xc + x, yc + y);
    point(xc - x, yc + y);
    point(xc + x, yc - y);
    point(xc - x, yc - y);
    point(xc + y, yc + x);
    point(xc - y, yc + x);
    point(xc + y, yc - x);
    point(xc - y, yc - x);

}

/* Bresenham circle drawing */
function bres_circle(r, xc, yc) {
    let d = 3 - (2 * r);
    let x = 0; //position of point x
    let y = r; //position of point y
    placePoints(xc, yc, x, y);
    while (y >= x) {

        if (d >= 0) {

            d = d + 4 * (x - y) + 10;
            x++;
            y--;
        } else {
            d = d + 4 * x + 6;
            x++;
        }

        placePoints(xc, yc, x, y);

    }
}

/* DDA line drawing algorithm */
function dda_line(x1, y1, x2, y2) {

    dx = x2 - x1;
    dy = y2 - y1;

    let m = dy / dx;
    ceil(m);
    if (m < 1) {
        while (x1 <= x2) {
            point(round(x1), round(y1));
            x1 = x1 + 1;
            y1 = y1 + m;
        }
    } else if (m > 1) {
        while (y1 <= y2) {
            point(round(x1), round(y1));
            x1 = x1 + 1 / m;
            y1 = y1 + 1;
        }
    } else {
        let steps = abs(max(dx, dy));
        for (let i = 0; i < steps; i++) {
            point(round(x1), round(y1));
            x1 = x1 + 1;
            y1 = y1 + 1;
        }
    }

}