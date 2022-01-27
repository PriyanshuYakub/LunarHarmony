//creating a video variable to store the video
let video;
//creating a image variable to store the video
let img;

function setup() {
    let bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = 'data/stars1.jpg';
    canvas = createCanvas(640, 360, WEBGL);
    canvas.id('p5canvas');
    background(0);
    video = createVideo('data/cat.mp4');
    video.hide(); //hiding video
    video.size(640, 360);
    video.id('p5Cat');
    video.loop(); //enabling video loop

    //using seriously.js to use vfx
    var seriously = new Seriously();
    var src = seriously.source('#p5Cat');
    var target = seriously.target('#p5canvas');
    let chroma = seriously.effect('chroma');
    chroma.source = '#p5Cat';
    let transform = seriously.transform('2d');
    transform.source = seriously.source(bgImage);

    //layers to separate backgrounfd and chroma processed video
    let layers = seriously.effect('layers', {
        count: 2
    });
    layers.source0 = transform;
    layers.source1 = chroma;
    canvas.source = layers;
    target.source = layers;
    seriously.go();
}