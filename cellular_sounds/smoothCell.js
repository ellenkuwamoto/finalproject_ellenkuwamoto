
//inspired by: https://sighack.com/post/chaikin-curves


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
    // returns two points based on the two points given 
    // two points in between the original points given the ratio
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
        n = chaikin_cut(a, b, ratio); // smooths segments using every vertice
        newVertices= newVertices.concat(n) // updates the array of vertices
      }
      return smoothCell(newVertices, ratio, iterations - 1);
      // reterns the shape verticies smoothed over by one ideration more and counts down the number of iterations left
    } else {
      return vertices 
      //returns the final smoothed shape verticies once the given ammount of iterations is done
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

  
  
  