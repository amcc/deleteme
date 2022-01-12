// check the framer branch for a more complex version that trims things

// let path;

// store paper size
let w;
let h;
let factor = 1;
let factor2 = 1;
let factor3 = 1;

let xSpeed = 1000;
let ySpeed = 1000;

let walk = 2;

// Make the paper scope global, by injecting it into window:
paper.install(window);

window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  w = paper.view.bounds.width;
  h = paper.view.bounds.height;

  let size = w / 8;

  let group = new Group({
    point: view.center,
  });

  let r1Size = 100;
  let path = new Path.Rectangle({
    point: [view.center.x - r1Size / 2, view.center.y - r1Size / 2],
    size: new Size(r1Size, r1Size),
    // fillColor: "black",
    parent: group,
    // strokeColor: "black",
    // applyMatrix: false,
    // visible: false,
  });
  let r2Size = 200;
  let bigPath = new Path.Rectangle({
    point: [view.center.x - r2Size / 2, view.center.y - r2Size / 2],
    size: new Size(r2Size, r2Size),
    // fillColor: "black",
    // strokeColor: "red",
    parent: group,
    // strokeColor: "black",
    // applyMatrix: false,
    // visible: false,
  });

  var rectangle = new Path.Rectangle({
    point: view.center,
    size: new Size(10, 10),
    fillColor: "black",
    // strokeColor: "black",
    applyMatrix: false,
    visible: false,
  });

  let brushArray = pointsOnPath(path, rectangle, 16, group);
  brushArray.forEach((e, index) => {
    e.selected = true;
  });
  // group.scaling.x = group.scaling.y = 0.01;

  paper.view.onFrame = function (event) {
    if (event.count % 600 === 0 && event.count > 0) {
      factor = factor * -1;
    }
    if (event.count % 700 === 0 && event.count > 0) {
      factor2 = factor2 * -1;
    }
    if (event.count % 700 === 0 && event.count > 0) {
      factor2 = factor2 * -1;
    }
    console.log(factor, event.count);
    // Each frame, rotate the path by 3 degrees:
    group.rotate(0.1 * factor2);
    // group.scaling.x = group.scaling.y += 0.003;
    brushArray.forEach((e, index) => {
      e.rotate(index * 0.02 * factor);
      e.scaling.x += (index / xSpeed) * factor2;
      e.scaling.y += (index / ySpeed) * factor2;
      // e.scaling.x += 1 / xSpeed;
      // e.scaling.y += 1 / ySpeed;
      e.strokeScaling = false;

      // e.position.x += Math.random() * walk - walk / 2;
      // e.position.y += Math.random() * walk - walk / 2;
    });
  };

  // when view is resized...
  paper.view.onResize = function () {
    // store new view width/height
    w = paper.view.bounds.width;
    h = paper.view.bounds.height;
  };

  // now draw
  paper.view.draw();
};

function pointsOnPath(path, brush, num, parent) {
  // store brush strokes in array
  let array = [];
  // enable start point to be spaced into path
  // we could make this zero and ensure we have one at the end somehow
  let start = path.length / (num * 2);

  for (let i = 0; i < num; i++) {
    let b = brush.clone();

    var offset = (path.length * i) / num + start;
    // Get point to position the rectangle.
    var point = path.getPointAt(offset);
    // Get tangent vector at this point.
    var tangent = path.getTangentAt(offset);

    b.position = point;
    b.rotation = tangent.angle;
    b.visible = true;

    if (parent) b.parent = parent;
    array.push(b);
  }
  return array;
}

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};
