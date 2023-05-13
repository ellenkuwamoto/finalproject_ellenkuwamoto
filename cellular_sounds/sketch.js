
/*
credits:
Dan Shiffman flocking - https://www.youtube.com/watch?v=mhjuuHl6qHM&t=1533s
Dan Shiffman attraction/repulsion - https://www.youtube.com/watch?v=OAcXnzRNiCY
c2.js examples Voroni - https://c2js.org/examples.html?name=Voronoi
chaikin curves - https://sighack.com/post/chaikin-curves
KILL DEM by Jamiexx - https://www.youtube.com/watch?v=6NLEp6awMQQ
*/

function preload(){
  song = loadSound ('data /JamiexxKILLDEM.mp3')
}
 
let song
let startPage
let amplitudemeasure
let amplitudeLevels
let separationAmplify  
let cellAmplify 
let agents = new Array(200);

function setup() {
 
  createCanvas(960, 540); //smaller canvas helps it run smoother
  colorMode(HSL, 360, 100, 100);

  startPage = true 
  amplitudeMeasure = new p5.Amplitude();
  amplitudeMeasure.setInput(song);

  for (let i = 0; i < agents.length; i++) agents[i] = new Boid();
  // stores boids as agent points at random initial locations
}
 
function draw() {
  //reads the song amplitude over time to get specific variables 
  amplitudeLevels = amplitudeMeasure.getLevel();
  separationAmplify = map(amplitudeLevels,0,.5,0,3) // changes cell separation in relation to amplitude
  cellAmplify =  map(amplitudeLevels,0,.5,-5,15) // changes strokeweight in relation to amplitude

  //start page so that song can start playing in browser
  if(startPage == true){
    fill(255)
    rect(0,0,width,height)
    stroke(0)
    strokeWeight(2)
    ellipse(width/2,height/2,100,100)
    fill(0)
    noStroke()
    text("click to play",width/2-30,height/2)
    //start page is as minimal as possible so it dosnt distract from the artpeice 
  } else{
    background(0) // remove this line for a cool sketchbook effect
    let voronoi = new c2.Voronoi();
    voronoi.compute(agents);
    let regions = voronoi.regions;
    stroke(0);
    strokeWeight(cellAmplify); //varies based on amplitude 

    for (let i = 0; i < regions.length; i++) {
      fill(255)
      drawCell(regions[i].vertices);
    }

    for (let i = 0; i < agents.length; i++) {
      agents[i].edges(); 
      agents[i].update();
      agents[i].flock(agents);
      agents[i].repulse();
      //agents[i].show(); //shows spawn points for the veronicells 
    }
  }
  //console.log(amplitudeLevels)
}
 
//controls the start page and plays song
function mousePressed() {
  startPage=false;
  let checkPlaying = song.isPlaying()
  if(checkPlaying == false){
    song.loop()
  }
}

// in the future i want to look into shaders or quad trees 
// i want add to the graphics without slowing down the computer
 