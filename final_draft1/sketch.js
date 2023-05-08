
/*
credits:
Dan Shiffman flocking - https://www.youtube.com/watch?v=mhjuuHl6qHM&t=1533s
c2.js examples Voroni - https://c2js.org/examples.html?name=Voronoi
chaikin curves - https://sighack.com/post/chaikin-curves
KILL DEM (song) by Jamiexx - https://www.youtube.com/watch?v=6NLEp6awMQQ
*/

//code is messy right now sorry I will add comments later

function preload(){
 song = loadSound ('data /JamiexxKILLDEM.mp3')
}

let song
let startPage
let amplitudemeasure
let amplitudeLevels
let separationAmplify  
let cellAmplify 
let agents = new Array(300);

function setup() {
  startPage = true 
  amplitudeMeasure = new p5.Amplitude();
  amplitudeMeasure.setInput(song);
  //createCanvas(960, 540);
  createCanvas(displayWidth, displayHeight);
  colorMode(HSL, 360, 100, 100);
  for (let i = 0; i < agents.length; i++) agents[i] = new Boid();
  // stores 20 agent points at random locations
}

function draw() {
  amplitudeLevels = amplitudeMeasure.getLevel();
  separationAmplify = map(amplitudeLevels,0,.5,0,3) // changes cell separation in relation to amplitude
  cellAmplify =  map(amplitudeLevels,0,.5,-5,15) // changes strokeweight in relation to amplitude

  //start page so that song starts playing in browser
  if(startPage == true){
    fill(255)
    rect(0,0,width,height)
    stroke(0)
    strokeWeight(2)
    ellipse(width/2,height/2,100,100)
    fill(0)
    noStroke()
    text("click to play",width/2-30,height/2)
  } else{
  background(0)
  let voronoi = new c2.Voronoi();
  voronoi.compute(agents);
  let regions = voronoi.regions;
  stroke(0);
  strokeWeight(cellAmplify);
  for (let i = 0; i < regions.length; i++) {
    fill(255)
    drawCell(regions[i].vertices);
  }

  for (let i = 0; i < agents.length; i++) {
    agents[i].edges(); //veroni points
    agents[i].update();
    agents[i].flock(agents);
    //agents[i].show();
  }
}
//console.log(allignmentAmplify)
}

//controls the start page and plays song
function mousePressed() {
  startPage=false;
  let  checkPlaying = song.isPlaying()
  if(checkPlaying == false){
    song.loop()
  }
}

//uses smoothed verticies and draws a shape
function drawCell(vertices){
  let smoothVertices= []
   smoothVertices = smoothCell(vertices, .75, 3)
  beginShape()
  for (let i of smoothVertices){
    vertex(i.x, i.y);
  }
  endShape(CLOSE);
}
//uses the segment cutting algorythem to add verticies 
// creates a smoother shape over multiple iderations 
 function smoothCell(vertices, ratio, iterations) {
  if (iterations>0){
    let vertexcount = vertices.length
    let newVertices = []
    for (let i=0; i<vertices.length; i++) {
      let a = vertices[i]
      let b = vertices[(i + 1) % vertexcount]
      // Break it using our chaikin_break() function
      let n = []
      n = chaikin_cut(a, b, ratio);
      newVertices=  newVertices.concat(n)
    }
    return smoothCell(newVertices, ratio, iterations - 1);
  } else {
    return vertices
  }
  
}


//algorythem cuts a segment of a shape into two based on the given ratio
function chaikin_cut( a,  b, ratio) {
  let x, y;
  n = []

  /* Find point at a given ratio going from A to B */
  x = lerp(b.x, a.x, ratio);
  y = lerp(b.y, a.y, ratio);
  n.push(new p5.Vector(x, y));

  /* Find point at a given ratio going from B to A */
  x = lerp(a.x, b.x, ratio);
  y = lerp(a.y, b.y, ratio);
  n.push(new p5.Vector(x, y));

  return n;
}