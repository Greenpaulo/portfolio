// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size

// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//   anchor.addEventListener('click', function (e) {
//     e.preventDefault();
//     var node = document.querySelector(this.getAttribute('href'));
//     let item = node;
//     //this is the parent container, overflow wrapper
//     let wrp = document.querySelector('#wr-page');
//     console.log(wrp)
//     let count = item.offsetTop - wrp.scrollTop;
//     wrp.scrollBy({ top: count, left: 0, behavior: 'smooth' })
//   });
// });

// Note: Requires removal of "overflow-x: hidden" on the body element in CSS
// window.onscroll = function () { scrollFunction() };

// function scrollFunction() {
//   if (document.body.scrollTop > 863 || document.documentElement.scrollTop > 863) {

//     document.getElementById("navbar").style.borderBottom = "1px solid black";
//     document.getElementById("header-content").style.borderBottom = "none";
//     // document.getElementById("logo").style.fontSize = "25px";
//   } else {
//     document.getElementById("navbar").style.borderBottom = "none";
//     document.getElementById("header-content").style.borderBottom = "1px solid black";
//     // document.getElementById("logo").style.fontSize = "35px";
//   }
// }





// Spiral

const wrapper1 = document.getElementById('wrapper1');
const wrapper2 = document.getElementById('wrapper2');

function spinner(wrapperEl, flag) {
  'use strict';
  // let wrapper, canvas, ctx, width, height,
  let wrapper = wrapperEl;
  let canvas, ctx, width, height,
    Tau = Math.PI * 2, PI180 = Math.PI / 180,
    systems = [];

  /* PlanetarySystem */
  let PlanetarySystem = function (id = 'pSys') {
    Object.defineProperty(this, 'id', { value: id, writable: true });
    Object.defineProperty(this, 'x', { value: 0, writable: true });
    Object.defineProperty(this, 'y', { value: 0, writable: true });
    Object.defineProperty(this, 'allBodies', { value: [], writable: true });
    Object.defineProperty(this, 'allBodiesLookup', { value: {}, writable: true });    // fast id lookup for children
    Object.defineProperty(this, 'numBodies', { value: 0, writable: true });
  }
  PlanetarySystem.prototype.addBody = function (vo) {
    vo.parentSystem = this;
    vo.parentBody = vo.parentBody === null ? this : this.allBodiesLookup[vo.parentBody];
    let body = new PlanetaryBody(vo);
    body.update();
    this.allBodies.push(body);
    this.allBodiesLookup[vo.id] = body;
    this.numBodies += 1;
  }
  PlanetarySystem.prototype.setSpeedFactor = function (value) {
    let body;
    for (let i = 0; i < this.numBodies; i++) {
      body = this.allBodies[i];
      body.setSpeedFactor(value);
    }
  }
  PlanetarySystem.prototype.update = function () {
    let body;
    for (let i = 0; i < this.numBodies; i++) {
      body = this.allBodies[i];
      body.update();
    }
  }
  /* PlanetaryBody */
  let PlanetaryBody = function (vo) {
    Object.defineProperty(this, 'id', { value: vo.id, writable: true });
    Object.defineProperty(this, 'diameter', { value: vo.diameter, writable: true });
    Object.defineProperty(this, 'colour', { value: vo.colour, writable: true });
    Object.defineProperty(this, 'x', { value: 0, writable: true });
    Object.defineProperty(this, 'y', { value: 0, writable: true });
    Object.defineProperty(this, 'vx', { value: 0, writable: true });
    Object.defineProperty(this, 'vy', { value: 0, writable: true });
    Object.defineProperty(this, 'degrees', { value: vo.degrees, writable: true });
    Object.defineProperty(this, 'speedBase', { value: vo.speed, writable: true });
    Object.defineProperty(this, 'speed', { value: vo.speed, writable: true });
    Object.defineProperty(this, 'orbitalRadius', { value: vo.orbitalRadius, writable: true });
    Object.defineProperty(this, 'parentSystem', { value: vo.parentSystem, writable: true });
    Object.defineProperty(this, 'parentBody', { value: vo.parentBody, writable: true });

    return this;
  }
  PlanetaryBody.prototype.update = function () {
    let angle = this.degrees * PI180;
    this.degrees += this.speed;
    this.vx = this.orbitalRadius * Math.cos(angle);
    this.vy = this.orbitalRadius * Math.sin(angle);
    // update position
    if (this.parentBody != null) {
      this.x = this.vx + this.parentBody.x;
      this.y = this.vy + this.parentBody.y;
    }
  }

  /* init() */
  function init(wrapper) {
    // wrapper = document.querySelector('#wrapper');
    canvas = createCanvas('canvas', width, height);
    wrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    setupEvents();
    resizeCanvas();

    /* Define new PlanetarySystem and set values */
    let system1 = new PlanetarySystem('pSys1');
    systems.push(system1);
    system1.x = width * .5;
    system1.y = height * .5;
    system1.addBody({ id: 'sun', diameter: 5, degrees: 0, speed: 0, colour: '#FDFE1D', orbitalRadius: 0, parentBody: null });
    for (let loop = 30, i = 0; i < loop; i += 1) {
      if (flag) {
        system1.addBody({
          id: 'ball' + i,
          diameter: 5,
          degrees: 0,
          speed: 2 + (loop * 0.15) - (i * 0.2),
          // speed: (2 + (loop * 0.15) - (i * 0.2)) / 2,
          colour: 'hsla(' + (i * (360 / loop) - 200) + ',50%,50%,1)',
          orbitalRadius: 11 * (i + 1),
          parentBody: 'sun'
        });
      } else {
        system1.addBody({
          id: 'ball' + i,
          diameter: 5,
          degrees: 0,
          speed: 2 + (loop * 0.15) - (i * 0.2),
          // speed: (2 + (loop * 0.15) - (i * 0.2))/2,
          colour: 'hsla(' + (i * (360 / loop)) + ',50%,50%,1)',
          orbitalRadius: 11 * (i + 1),
          parentBody: 'sun'
        });
      }
    }
  }

  /* Methods */
  function createCanvas(id, w, h) {
    let tCanvas = document.createElement('canvas');
    tCanvas.width = w;
    tCanvas.height = h;
    tCanvas.id = id;
    return tCanvas;
  }

  function setupEvents() {
    window.onresize = resizeCanvas;
  }
  function resizeCanvas() {
    let rect = wrapper.getBoundingClientRect();
    // Desktop
    // width = window.innerWidth/2;
    // width = window.innerWidth/2;
    // Ipad Pro & Ipad
    // width = window.innerWidth;
    // Pixel2 XL,iphone 6/7/8 plus, iphoneX
    // width = window.innerWidth*2;

    // Desktop/Ipad Pro/Ipad
    // canvas.width = width/3;
    // Pixel2 XL,iphone 6/7/8 plus, iphoneX
    // canvas.width = width;

    switch (true) {
      // Large Desktop Dislay
      case (window.innerWidth >= 1400):
        width = window.innerWidth / 2;
        console.log('case1')
        break;
      // Desktop
      case (window.innerWidth > 1024 && window.innerWidth < 1400):
        width = window.innerWidth / 1.5;
        console.log('case2')
        break;
      // Ipad Pro & Ipad
      case (window.innerWidth <= 1024 && window.innerWidth > 675):
        width = window.innerWidth;
        console.log('case3')
        break;
      case (window.innerWidth <= 675 && window.innerWidth > 559):
        width = window.innerWidth * 1.2;
        console.log('case4')
        break;
      case (window.innerWidth <= 559 && window.innerWidth > 512):
        width = window.innerWidth * 1.4;
        console.log('case4')
        break;
      case (window.innerWidth <= 512 && window.innerWidth > 414):
        width = window.innerWidth * 1.6;
        console.log('case4')
        break;
      // Pixel2 XL,iphone 6/7/8 plus, iphoneX
      case (window.innerWidth <= 414 && window.innerWidth > 380):
        width = window.innerWidth * 1.8;
        console.log('case5');
        break;
      // Small mobile e.g. iphone5
      case (window.innerWidth <= 380):
        width = window.innerWidth * 2.5;
        console.log('case6');
        break;
      // default:
      //   width = window.innerWidth;
    }

    console.log(flag);
    if (flag) {
      canvas.width = width;
    } else {
      canvas.width = width / 3;
    }


    // switch (true) {
    //   // Desktop/Ipad Pro/Ipad
    //   case (window.innerWidth > 414):
    //     canvas.width = width / 3;
    //     break;
    //   // // Pixel2 XL,iphone 6/7/8 plus, iphoneX
    //   case (window.innerWidth <= 414):
    //     canvas.width = width;
    //     break;
    // }
    // console.log('before calc', window.innerHeight);
    // console.log('rect', rect.top);
    // height = window.innerHeight / 1.2 - rect.top - 2;
    height = window.innerHeight / 1.3;
    // console.log('after calc', height);



    // Desktop
    // height = window.innerHeight/1.1 - rect.top - 2;

    // switch (true) {
    //     // Desktop/Ipad Pro/Ipad
    //     case (window.innerWidth > 1024):
    //       height = window.innerHeight / 1.3;
    //       break;
    //     case (window.innerWidth <= 1024 && window.innerWidth >= 768):
    //       height = window.innerHeight / 1.3;
    //       break;
    //     // // Pixel2 XL,iphone 6/7/8 plus, iphoneX
    //     case (window.innerWidth < 768):
    //       break;
    //   }
    console.log('width', window.innerWidth);
    console.log('height', window.innerHeight);
    // console.log('calculated height', height);
    // console.log('canvas width', canvas.width);
    // console.log('canvas height', canvas.height);

    canvas.height = height;
    for (let i = 0; i < systems.length; i++) {
      systems[i].x = width * .5;
      systems[i].y = height * .5;
    }
  }

  function update() {
    for (let loop = systems.length, i = 0; i < loop; i++) {
      systems[i].update();
    }
  }

  function draw() {
    let system;
    let prev = null;
    for (let i = 0; i < systems.length; i++) {
      system = systems[i];
      let planetaryBody;
      for (let loop = system.numBodies, j = 1; j < loop; j += 1) {
        planetaryBody = system.allBodies[j];
        ctx.beginPath();
        ctx.arc(planetaryBody.x, planetaryBody.y, planetaryBody.diameter, 0, Tau, false);
        ctx.fillStyle = planetaryBody.colour;
        ctx.fill();
        if (j > 1) {
          ctx.strokeStyle = planetaryBody.colour;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(planetaryBody.x, planetaryBody.y);
          ctx.lineTo(prev.x, prev.y);
          // ctx.stroke();
        }
        prev = { x: planetaryBody.x, y: planetaryBody.y };
      }
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(255,255,255, .08)';
    ctx.fillRect(0, 0, width, height);
    update();
    draw();
    requestAnimationFrame(animate);
  }

  console.log(wrapper);
  init(wrapper);
  animate();

};

spinner(wrapper1, false);
spinner(wrapper2, true);




// // Spiral

// (function () {
//   'use strict';
//   let wrapper, canvas, ctx, width, height,
//     Tau = Math.PI * 2, PI180 = Math.PI / 180,
//     systems = [];

//   /* PlanetarySystem */
//   let PlanetarySystem = function (id = 'pSys') {
//     Object.defineProperty(this, 'id', { value: id, writable: true });
//     Object.defineProperty(this, 'x', { value: 0, writable: true });
//     Object.defineProperty(this, 'y', { value: 0, writable: true });
//     Object.defineProperty(this, 'allBodies', { value: [], writable: true });
//     Object.defineProperty(this, 'allBodiesLookup', { value: {}, writable: true });    // fast id lookup for children
//     Object.defineProperty(this, 'numBodies', { value: 0, writable: true });
//   }
//   PlanetarySystem.prototype.addBody = function (vo) {
//     vo.parentSystem = this;
//     vo.parentBody = vo.parentBody === null ? this : this.allBodiesLookup[vo.parentBody];
//     let body = new PlanetaryBody(vo);
//     body.update();
//     this.allBodies.push(body);
//     this.allBodiesLookup[vo.id] = body;
//     this.numBodies += 1;
//   }
//   PlanetarySystem.prototype.setSpeedFactor = function (value) {
//     let body;
//     for (let i = 0; i < this.numBodies; i++) {
//       body = this.allBodies[i];
//       body.setSpeedFactor(value);
//     }
//   }
//   PlanetarySystem.prototype.update = function () {
//     let body;
//     for (let i = 0; i < this.numBodies; i++) {
//       body = this.allBodies[i];
//       body.update();
//     }
//   }
//   /* PlanetaryBody */
//   let PlanetaryBody = function (vo) {
//     Object.defineProperty(this, 'id', { value: vo.id, writable: true });
//     Object.defineProperty(this, 'diameter', { value: vo.diameter, writable: true });
//     Object.defineProperty(this, 'colour', { value: vo.colour, writable: true });
//     Object.defineProperty(this, 'x', { value: 0, writable: true });
//     Object.defineProperty(this, 'y', { value: 0, writable: true });
//     Object.defineProperty(this, 'vx', { value: 0, writable: true });
//     Object.defineProperty(this, 'vy', { value: 0, writable: true });
//     Object.defineProperty(this, 'degrees', { value: vo.degrees, writable: true });
//     Object.defineProperty(this, 'speedBase', { value: vo.speed, writable: true });
//     Object.defineProperty(this, 'speed', { value: vo.speed, writable: true });
//     Object.defineProperty(this, 'orbitalRadius', { value: vo.orbitalRadius, writable: true });
//     Object.defineProperty(this, 'parentSystem', { value: vo.parentSystem, writable: true });
//     Object.defineProperty(this, 'parentBody', { value: vo.parentBody, writable: true });

//     return this;
//   }
//   PlanetaryBody.prototype.update = function () {
//     let angle = this.degrees * PI180;
//     this.degrees += this.speed;
//     this.vx = this.orbitalRadius * Math.cos(angle);
//     this.vy = this.orbitalRadius * Math.sin(angle);
//     // update position
//     if (this.parentBody != null) {
//       this.x = this.vx + this.parentBody.x;
//       this.y = this.vy + this.parentBody.y;
//     }
//   }

//   /* init() */
//   function init() {
//     wrapper = document.querySelector('#wrapper');
//     canvas = createCanvas('canvas', width, height);
//     wrapper.appendChild(canvas);
//     ctx = canvas.getContext('2d');
//     setupEvents();
//     resizeCanvas();

//     /* Define new PlanetarySystem and set values */
//     let system1 = new PlanetarySystem('pSys1');
//     systems.push(system1);
//     system1.x = width * .5;
//     system1.y = height * .5;
//     system1.addBody({ id: 'sun', diameter: 5, degrees: 0, speed: 0, colour: '#FDFE1D', orbitalRadius: 0, parentBody: null });
//     for (let loop = 30, i = 0; i < loop; i += 1) {
//       system1.addBody({
//         id: 'ball' + i,
//         diameter: 5,
//         degrees: 0,
//         speed: 2 + (loop * 0.15) - (i * 0.2),
//         // speed: (2 + (loop * 0.15) - (i * 0.2)) / 5,
//         colour: 'hsla(' + (i * (360 / loop)) + ',50%,50%,1)',
//         orbitalRadius: 11 * (i + 1),
//         parentBody: 'sun'
//       });
//     }
//   }

//   /* Methods */
//   function createCanvas(id, w, h) {
//     let tCanvas = document.createElement('canvas');
//     tCanvas.width = w;
//     tCanvas.height = h;
//     tCanvas.id = id;
//     return tCanvas;
//   }

//   function setupEvents() {
//     window.onresize = resizeCanvas;
//   }
//   function resizeCanvas() {
//     let rect = wrapper.getBoundingClientRect();
//     // Desktop
//     // width = window.innerWidth/2;
//     // width = window.innerWidth/2;
//     // Ipad Pro & Ipad
//     // width = window.innerWidth;
//     // Pixel2 XL,iphone 6/7/8 plus, iphoneX
//     // width = window.innerWidth*2;

//     // Desktop/Ipad Pro/Ipad
//     // canvas.width = width/3;
//     // Pixel2 XL,iphone 6/7/8 plus, iphoneX
//     // canvas.width = width;

//     switch (true) {
//       // Large Desktop Dislay
//       case (window.innerWidth >= 1400):
//         width = window.innerWidth / 2;
//         // console.log('case1')
//         break;
//       // Desktop
//       case (window.innerWidth > 1024 && window.innerWidth < 1400):
//         width = window.innerWidth / 1.5;
//         // console.log('case2')
//         break;
//       // Ipad Pro & Ipad
//       case (window.innerWidth <= 1024 && window.innerWidth > 675):
//         width = window.innerWidth;
//         // console.log('case3')
//         break;
//       case (window.innerWidth <= 675 && window.innerWidth > 559):
//         width = window.innerWidth * 1.2;
//         // console.log('case4')
//         break;
//       case (window.innerWidth <= 559 && window.innerWidth > 512):
//         width = window.innerWidth * 1.4;
//         // console.log('case4')
//         break;
//       case (window.innerWidth <= 512 && window.innerWidth > 414):
//         width = window.innerWidth * 1.6;
//         // console.log('case4')
//         break;
//       // Pixel2 XL,iphone 6/7/8 plus, iphoneX
//       case (window.innerWidth <= 414 && window.innerWidth > 380):
//         width = window.innerWidth * 1.8;
//         // console.log('case5');
//         break;
//       // Small mobile e.g. iphone5
//       case (window.innerWidth <= 380):
//         width = window.innerWidth * 2.5;
//         // console.log('case6');
//         break;
//       // default:
//       //   width = window.innerWidth;
//     }

//       // canvas.width = width;
//       canvas.width = width/3;


//     // switch (true) {
//     //   // Desktop/Ipad Pro/Ipad
//     //   case (window.innerWidth > 414):
//     //     canvas.width = width / 3;
//     //     break;
//     //   // // Pixel2 XL,iphone 6/7/8 plus, iphoneX
//     //   case (window.innerWidth <= 414):
//     //     canvas.width = width;
//     //     break;
//     // }
//     // console.log('before calc', window.innerHeight);
//     // console.log('rect', rect.top);
//     // height = window.innerHeight / 1.2 - rect.top - 2;
//     height = window.innerHeight / 1.3;
//     // console.log('after calc', height);
    
    
    
//     // Desktop
//     // height = window.innerHeight/1.1 - rect.top - 2;
    
//     // switch (true) {
//     //     // Desktop/Ipad Pro/Ipad
//     //     case (window.innerWidth > 1024):
//     //       height = window.innerHeight / 1.3;
//     //       break;
//     //     case (window.innerWidth <= 1024 && window.innerWidth >= 768):
//     //       height = window.innerHeight / 1.3;
//     //       break;
//     //     // // Pixel2 XL,iphone 6/7/8 plus, iphoneX
//     //     case (window.innerWidth < 768):
//     //       break;
//     //   }
//       // console.log('width', window.innerWidth);
//       // console.log('height', window.innerHeight);
//       // console.log('calculated height', height);
//       // console.log('canvas width', canvas.width);
//       // console.log('canvas height', canvas.height);
      
//       canvas.height = height;
//       for (let i = 0; i < systems.length; i++) {
//         systems[i].x = width * .5;
//         systems[i].y = height * .5;
//       }
//     }
    
//     function update() {
//       for (let loop = systems.length, i = 0; i < loop; i++) {
//         systems[i].update();
//     }
//   }

//   function draw() {
//     let system;
//     let prev = null;
//     for (let i = 0; i < systems.length; i++) {
//       system = systems[i];
//       let planetaryBody;
//       for (let loop = system.numBodies, j = 1; j < loop; j += 1) {
//         planetaryBody = system.allBodies[j];
//         ctx.beginPath();
//         ctx.arc(planetaryBody.x, planetaryBody.y, planetaryBody.diameter, 0, Tau, false);
//         ctx.fillStyle = planetaryBody.colour;
//         ctx.fill();
//         if (j > 1) {
//           ctx.strokeStyle = planetaryBody.colour;
//           ctx.lineWidth = 2;
//           ctx.beginPath();
//           ctx.moveTo(planetaryBody.x, planetaryBody.y);
//           ctx.lineTo(prev.x, prev.y);
//           // ctx.stroke();
//         }
//         prev = { x: planetaryBody.x, y: planetaryBody.y };
//       }
//     }
//   }

//   function animate() {
//     ctx.fillStyle = 'rgba(255,255,255, .08)';
//     ctx.fillRect(0, 0, width, height);
//     update();
//     draw();
//     requestAnimationFrame(animate);
//   }

//   init();
//   animate();

// }());








// GSAP

// Stagger Length
const sl = 0.2;
// Delay lenght
const dl = 0.5;

// Create new timeline
let tl = gsap.timeline({repeat: -1});

// Languages
tl.from('#title1', { opacity: 0, duration: 1, ease: "bounce.out", delay: dl})
  .from('.lang-col-1', {x: -150, opacity: 0, stagger: sl, ease: "power1.in"})
  .from('.lang-col-2', { x: 150, opacity: 0, stagger: sl, ease: "power1.in"})
  .addLabel("fade1", "+=5")
  .to('.lang-col-1', { x: -150, opacity: 0, stagger: sl, ease: "power1.in" }, "fade1")
  .to('.lang-col-2', { x: 150, opacity: 0, stagger: sl, ease: "power1.in" }, "fade1")
  .to('#title1', { opacity: 0, duration: 1, ease: "power1.in" }, "fade1")
  
// Frameworks
tl.from('#title2', { opacity: 0, duration: 1, ease: "bounce.out", delay: dl})
  .from('.frame-col-1', {x: -100, opacity: 0, stagger: 0.2, ease: "power1.in"})
  .from('.frame-col-2', {x: 100, opacity: 0, stagger: 0.2, ease: "power1.in"})
  .addLabel("fade2", "+=5")
  .to('.frame-col-1', { x: -100, opacity: 0, stagger: 0.2, ease: "power1.in"}, "fade2")
  .to('.frame-col-2', { x: 100, opacity: 0, stagger: 0.2, ease: "power1.in" }, "fade2")
  .to('#title2', { opacity: 0, duration: 1, ease: "power1.in" }, "fade2")

// Databases/Libaries
tl.from('#title3', { opacity: 0, duration: 1, ease: "bounce.out", delay: dl})
  .from('.db-col-1', {x: -100, opacity: 0, stagger: 0.2, ease: "power1.in"})
  .from('.db-col-2', {x: 100, opacity: 0, stagger: 0.2, ease: "power1.in"})
  .addLabel("fade3", "+=5")
  .to('.db-col-1', { x: -100, opacity: 0, stagger: 0.2, ease: "power1.in" }, "fade3")
  .to('.db-col-2', { x: 100, opacity: 0, stagger: 0.2, ease: "power1.in" }, "fade3")
  .to('#title3', { opacity: 0, duration: 1, ease: "power1.in" }, "fade3");

// // Libraries  
// tl.from('#title4', { opacity: 0, duration: 1, ease: "bounce.out", delay: dl})
//   .from('.lib-col-1', {x: -100, opacity: 0, stagger: 0.2, ease: "power1.in"})
//   .from('.lib-col-2', {x: 100, opacity: 0, stagger: 0.2, ease: "power1.in"})
//   .addLabel("fade4", "+=5")
//   .to('.lib-col-1', { x: -100, opacity: 0, stagger: 0.2, ease: "power1.in" }, "fade4")
//   .to('.lib-col-2', { x: 100, opacity: 0, stagger: 0.2, ease: "power1.in" }, "fade4")
//   .to('#title4', { opacity: 0, duration: 1, ease: "power1.in" }, "fade4")


