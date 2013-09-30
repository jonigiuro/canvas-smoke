/** MY PARTICLES **/

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var Particles = function() {
    this.oPoint = {
        x: 0,
        y:0
    }
    this.addPuffs = false;
    this.maxParticles = 200;
    this.imageSrc = "img/smoke_particle.png"
    this.canvas = null;
    this.ctx = null;
    this.windX = .5;
    this.windY = -5;
    this.alphaDecrease = .006;
    this.growingSpeed = 2.9;
    this.jitterX = 2;
    this.jitterY = 1;
    this.speedXJitter = 4;
    this.speedYJitter = 10;
    this.puffs = [];
    this.maxLife = 200;
    this.cWidth = screen.width;
    this.cHeight = screen.height;
    this.img = new Image();
    this.img.src = this.imageSrc;
    this.alphaDie = .05;
    this.bornSize = 10;

    this.init = function() {
        var self = this;
        document.onmousemove = function(e) {
            self.oPoint.x = e.clientX;
            self.oPoint.y = e.clientY;
        }
        
        document.onmousedown = function() {
            self.addPuffs = true;
        }
        
        document.onmouseup = function() {
            self.addPuffs = false;
        }
        //CREATE THE CANVAS
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';

        document.body.appendChild(this.canvas);
        document.getElementsByTagName('body')[0].appendChild(canvas);

        this.canvas.width = this.cWidth;
        this.canvas.height = this.cHeight;
        
        this.applyStyles(canvas);
        
        this.ctx = canvas.getContext("2d");

        (function animloop(){
            requestAnimFrame(animloop);
            self.tick();
        })();
    }
    
    this.applyStyles = function( element ) {
        element.style.position = "absolute";
        element.style.top = 0;
        element.style.left = 0
    }

    //STEP DONE EACH FRAME
    this.tick = function() {

        var self = this;
        var puffLength = this.puffs.length;

        //ONLY ADD PUFFS WHEN NEEDED
        if ( this.addPuffs && ( puffLength < this.maxParticles )) {
            this.puffs.push(this.newPuff());
        }

        this.ctx.clearRect(0,0,this.cWidth,this.cHeight)

        //ANIMATE PUFFS PROPERTIES
        for(var i = 0; i < puffLength ; i++) {
            var currentPuff = this.puffs[i];
            if( currentPuff ) {

                //REMOVE THE CURRENPUFF IF IT HAS GONE INVISIBLE OR IF IT LIVED LONG ENOUGH
                if(currentPuff.age == this.maxLife || currentPuff.alpha <= .05) {
                    this.puffs.splice(0, 1);
                } else {
                    currentPuff.posX = currentPuff.posX + (this.windX + currentPuff.speedX);
                    currentPuff.posY = currentPuff.posY + this.windY;
                    currentPuff.scale += this.growingSpeed;
                    currentPuff.age++;
                    currentPuff.alpha -= this.alphaDecrease;
                    this.render( currentPuff );

                }

            }
            
        }

    }

    this.newPuff = function() {
        return {
                posX: this.oPoint.x + Math.random() * this.jitterX - (this.jitterX / 2),
                posY: this.oPoint.y + Math.random() * this.jitterY - (this.jitterY / 2),
                speedX: Math.random() * this.speedXJitter,
                speedY: Math.random() * this.speedYJitter,
                scale: this.bornSize - 80,
                age: 0,
                alpha: .7,
            }
    }

        
    this.render = function( currentPuff ) {
        var puffLength = this.puffs.length;

        this.ctx.globalAlpha = currentPuff.alpha;
        this.ctx.drawImage(this.img, currentPuff.posX, currentPuff.posY, currentPuff.scale + 80, currentPuff.scale + 80);
        
        
    }

    this.init();
}

window.onload = function() {
	var particles = new Particles();
	var gui = new dat.GUI();
	gui.add(particles, 'maxParticles', 20, 500);
    gui.add(particles, 'bornSize', 0, 500);
	gui.add(particles, 'windX', -30, 30);
	gui.add(particles, 'windY', -30, 30);
	gui.add(particles, 'alphaDecrease', 0.001, 0.1);
	gui.add(particles, 'growingSpeed', 0, 10);
	gui.add(particles, 'jitterX', 0, 1500);
	gui.add(particles, 'jitterY', 0, 1500);
	gui.add(particles, 'speedXJitter', 0, 20);
	gui.add(particles, 'speedYJitter', 0, 20);
	gui.add(particles, 'maxLife', 0, 400);
	gui.add(particles, 'alphaDie', 0, .1);
}

