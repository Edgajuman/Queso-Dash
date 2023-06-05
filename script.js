var Jump = Sketch.create({fullscreen: false, width: 320, height: 512}), i = 0, j = 0;

  function Vector2(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.previousX = 0;
    this.previousY = 0;
  };

  Vector2.prototype.setPosition = function(x, y) {

    this.previousX = this.x;
    this.previousY = this.y;

    this.x = x;
    this.y = y;

  };

  Vector2.prototype.setX = function(x) {

    this.previousX = this.x;
    this.x = x;

  };

  Vector2.prototype.setY = function(y) {

    this.previousY = this.y;
    this.y = y;

  };


  Vector2.prototype.insercects = function(obj){

    if(obj.x < this.x + this.width && obj.y < this.y + this.height &&
       obj.x + obj.width > this.x && obj.y + obj.height > this.y ){
      return true;
    }

    return false;
  };

  Vector2.prototype.insercectsTop = function(obj){

    if(obj.x < this.x + this.width && obj.x + obj.width > this.x
        &&  obj.y > this.y + this.height ){
      return true;
    }

    return false;
  };

  function Particle(options) {

    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.size = options.size;
    this.orbitX = options.orbitX;
    this.orbitY = options.orbitY;
    this.speedX = options.speedX;
    this.speedY = options.speedY;
    this.aceleration = 1.02;

    this.angle = 0;

  };

  Particle.prototype.update = function() {

    this.x += this.vx;
    this.y += this.vy;

    this.x += Math.cos(this.angle * this.speedX) * this.orbitX;
    this.y += Math.sin(this.angle * this.speedY) * this.orbitY;

    this.y += Jump.camera;

    this.angle += 0.02;

    this.size *= 0.97   ;

  };

  Particle.prototype.draw = function() {
    Jump.fillRect(this.x, this.y, this.size, this.size);
  };

  function Player(x,y){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = Jump.gridSize;
    this.height = Jump.gridSize;
    this.previousX = 0;
    this.previousY = 0;
  }

  Player.prototype = new Vector2;

  Player.prototype.update = function() {
    this.vy += 1;

    this.y += Jump.camera;

    this.setPosition(this.x + this.vx, this.y + this.vy);

    if(Jump.keys.UP && this.vy < -8){
      this.vy += -0.75;
    }

    if(Jump.keys.LEFT && this.vx === 0){
      this.x += -5;
    }

    if(Jump.keys.RIGHT && this.vx === 0){
      this.x += 5;
    }

    if(this.x < -Jump.gridSize){
      this.x = Jump.width;
    }

    if(this.x > Jump.width){
      this.x = -Jump.gridSize;
    }

    if(this.y > Jump.height){
      Jump.init();
    }

  };

  Player.prototype.draw = function() {
    //Jump.fillText(this.y, this.x, this.y - 10);
    Jump.fillRect(this.x, this.y, this.width, this.height);
  };

  function Platform(x,y,size, height){
    this.x = x;
    this.y = y;
    this.size = size;
    this.x = x;
    this.y = y;
    this.width = this.size * Jump.gridSize;
    this.height = height || Jump.gridSize ;
    this.previousX = 0;
    this.previousY = 0;
    Jump.index++
    this.index = Jump.index;
  }

  Platform.prototype = new Vector2;

  Platform.prototype.update = function() {

    this.setPosition(this.x, this.y + Jump.camera);

    if(this.y > Jump.height){
      Jump.index++;
      this.index = Jump.index;
      this.reset();
    }

  };

  Platform.prototype.reset = function() {
    this.x = random(0, Jump.width - (2 * Jump.gridSize));
    this.y = -Jump.gridSize;
    this.size = random(2,5);
    this.width = this.size * Jump.gridSize;
  };

  Platform.prototype.draw = function() {
    Jump.fillRect(this.x, this.y + Jump.camera, this.width, this.height);
  };

  function Wall(x,y,size, height){
    this.x = x;
    this.y = y;
    this.size = size;
    this.x = x;
    this.y = y;
    this.width = this.size * Jump.gridSize;
    this.height = height || Jump.gridSize ;
    this.previousX = 0;
    this.previousY = 0;
    this.index = Jump.index;
  }

  Wall.prototype = new Vector2;

  Wall.prototype.update = function() {

    this.setPosition(this.x, this.y + Jump.camera);

    if(this.y > Jump.height){

      this.reset();
    }

  };

  Wall.prototype.reset = function() {
    this.x = random([0, Jump.width - Jump.gridSize]);
    this.y = -this.height;
    this.size = 1;
    this.width = this.size * Jump.gridSize;
  };

  Wall.prototype.draw = function() {
    Jump.fillRect(this.x, this.y + Jump.camera, this.width, this.height);
  };

  function PlatformManager(){
    this.p = [
              new Platform(0, Jump.height - Jump.gridSize, 10 ),
              new Platform(random(0, Jump.width - (2 * Jump.gridSize)), Jump.height- (Jump.gridSize * 5), random(2,5) ),
              new Platform(random(0, Jump.width - (2 * Jump.gridSize)), Jump.height- (Jump.gridSize * 10), random(2,5) ),
              new Platform(random(0, Jump.width - (2 * Jump.gridSize)), Jump.height- (Jump.gridSize * 14), random(2,5) )
             ];

    this.wall = [new Wall(0, Jump.gridSize * 8, 1, 10 * Jump.gridSize ), new Wall(Jump.width - Jump.gridSize, Jump.gridSize * 1, 1, 10 * Jump.gridSize )];
  }

  //Platform.prototype.

  Jump.setup = function() {

    this.particles = [];
    this.particlesMax = 40;
    this.particlesIndex = 0;
    this.score = 0;
    this.gridSize = 32;
    this.camera = 0;
    this.cameraPosition = 0;
    this.tick = 0;
    this.record = 0;
    this.intersectionIndex = 0;
    //this.ground = new Platform(0, this.height - this.gridSize, 10 );
    this.lastIntersectionIndex = 0;
    this.intersectionNextIndex = 0;
    this.player = new Player((this.width / 2) - this.gridSize, this.height - (this.gridSize * 2));
    this.index = 0;
    this.platformManager = new PlatformManager();
    this.cols = [];
    this.score = 0;


    this.jump = new Audio();
    this.jump.src = jsfxr([0,,0.3119,,0.1587,0.3629,,0.1689,,,,,,0.2415,,,,,1,,,0.2351,,0.5]);

  };

  Jump.init = function() {

    this.index = 0;
    this.cameraPosition = 0;
    this.camera = 0;
    this.lastIntersectionIndex = 0;
    this.intersectionNextIndex = 0;
    this.intersectionIndex = 0;
    this.score = 0;
    this.platformManager = new PlatformManager();
    this.player = new Player((this.width / 2) - this.gridSize, this.height - (this.gridSize * 2));
  };

  Jump.update = function() {

    if(this.player.y < this.height / 1.8){
      this.cameraPosition = 6;
    } else {
      this.cameraPosition = 0;
    }

    this.camera += (this.cameraPosition - this.camera) * 0.1 ;

    this.score += this.camera;

    if(this.score > this.record){
      this.record = this.score;
    }


    for (i = this.platformManager.p.length - 1; i >= 0; i--) {
      this.platformManager.p[i].update();
    }

    for (i = this.platformManager.p.length - 1; i >= 0; i--) {
      if(this.platformManager.p[i].index === this.platformManager.p[this.lastIntersectionIndex].index + 1){
        this.intersectionNextIndex = i;
        break;
      }
    }

    if(this.player.insercects(this.platformManager.p[this.lastIntersectionIndex])){

      this.player.y = this.platformManager.p[this.lastIntersectionIndex].y - this.platformManager.p[this.lastIntersectionIndex].height;

      this.player.vx = 0;
      this.player.vy = 0;
      if(Jump.keys.UP){
        this.player.vy = -13;
        this.jump.play();
        for (i = 0; i < 5; i++) {

          this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
            x: this.player.x + this.player.width,
            y:  this.player.y + this.player.height,
            vx: random([5,2]),
            vy: random([-8,-2]),
            size: random(4,8),
            orbitX: random(2,8),
            orbitY: random(2,5),
            speedX: random(2,8),
            speedY: random(2,5)
          });

          this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
            x: this.player.x,
            y:  this.player.y + this.player.height,
            vx: random([-8,-2]),
            vy: random([-8,-2]),
            size: random(4,8),
            orbitX: random(-8, -2),
            orbitY: random(-5, -2),
            speedX: random(-8, -2),
            speedY: random(-5, -2)
          });

        };
      }

      if(this.keys.LEFT){
        if(this.tick % 2 === 0){

          this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
            x: this.player.x + this.player.width,
            y:  this.player.y + this.player.height,
            vx: random([5,3]),
            vy: random([-8,-5]),
            size: random(4,8),
            orbitX: random(2,8),
            orbitY: random(2,5),
            speedX: random(2,8),
            speedY: random(2,5)
          });

        }

      }

      if(this.keys.RIGHT){
        if(this.tick % 2 === 0){
          this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
            x: this.player.x,
            y:  this.player.y + this.player.height,
            vx: random([-5,-3]),
            vy: random([-8,-5]),
            size: random(4,8),
            orbitX: random(-8, -2),
            orbitY: random(-5, -2),
            speedX: random(-8, -2),
            speedY: random(-5, -2)
          });
        }

      }


    }

    if(this.player.insercectsTop(this.platformManager.p[this.intersectionNextIndex])){

      this.lastIntersectionIndex = this.intersectionNextIndex;
    }

    for (i = this.particles.length - 1; i >= 0; i--) {

      this.particles[i].update();

    };

    for (i = this.platformManager.wall.length - 1; i >= 0; i--) {
      this.platformManager.wall[i].update();
      if(this.player.insercects(this.platformManager.wall[i])){
        if(this.player.x > this.width / 2){
          this.player.vx = -5;
          this.player.vy = -10;
          for (j = 0; j < 7; j++) {

            this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
              x: random(this.player.x, this.player.x + this.player.width),
              y: random(this.player.y, this.player.y + this.player.height),
              vx: random(-10,-8),
              vy: random(-12,8),
              size: random(4,8),
              orbitX: random(-8, -2),
              orbitY: random(-5, -2),
              speedX: random(-8, -2),
              speedY: random(-5, -2)
            });

          }
        }
        if(this.player.x < this.width / 2){
          this.player.vx = 5;
          this.player.vy = -10;

          for (j = 0; j < 7; j++) {

            this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
              x: random(this.player.x, this.player.x + this.player.width),
              y: random(this.player.y, this.player.y + this.player.height),
              vx: random(8,10),
              vy: random(-12,8),
              size: random(4,8),
              orbitX: random(8, 2),
              orbitY: random(5, 2),
              speedX: random(8, 2),
              speedY: random(5, 2)
            });

          }

        }

      }
    }

    //this.ground.update();
    this.player.update();


    this.tick++;

  };

  Jump.draw = function() {

    this.fillStyle = '#181818';

    for (i = this.platformManager.p.length - 1; i >= 0; i--) {
      //debug
      // if(i === this.intersectionNextIndex){
      //   this.fillStyle = 'rgba(24,205,205,0.8);'
      // } else if(i === this.lastIntersectionIndex){
      //   this.fillStyle = 'rgba(24,200,24,0.8);';
      // } else {
      //   this.fillStyle = '#181818';
      // }

        this.platformManager.p[i].draw();

    }

    this.platformManager.wall[0].draw();
    this.platformManager.wall[1].draw();

    for (i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].draw();
    };

    this.fillStyle = '#181818';
    this.player.draw();
    //this.ground.draw();
    // this.fillStyle = 'rgba(24,24,24,0.2);'
    // this.fillRect(this.platformManager.p[this.intersectionNextIndex].x, 0, this.platformManager.p[this.intersectionNextIndex].width, this.height );
    this.fillStyle = 'rgba(255,255,255,0.6);'
    this.fillRect(5,4, 80,28);
    this.fillStyle = '#181818';
    this.fillText('Score:' + Math.round(this.score), 10, 15);
    this.fillText('Record: ' + Math.round(this.record), 10, 28);


  };


/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // I moved this here from the reset(true) function
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // All variables are kept alive through function closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // Length of the attack stage
      _envelopeLength1, // Length of the sustain stage
      _envelopeLength2, // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = function() {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // I split the reset() function into two functions for better readability
  this.totalReset = function() {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // Full length of the volume envelop (and therefore sound)
    // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = function(buffer, length) {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p['s'] != 1 || p['v'],
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'],
        // Minimum frequency before stopping
        _minFreqency = p['g'],
        // If the phaser is active
        _phaser = p['q'] || p['r'],
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'],
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2,
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // The type of wave to generate
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

    // Damping muliplier which restricts how fast the wave position can move
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample,          // Actual sample writen to the wave
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1;
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
        _period = _maxPeriod;
        if (_minFreqency > 0) {
          _finished = true;
        }
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0;
      if (_periodTemp < 8) {
        _periodTemp = 8;
      }

      // Sweeps the square duty
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

        switch (++_envelopeStage)  {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
        }
      }

      // Sets the volume based on the position in the envelope
      switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0;
          _finished = true;
      }

      // Moves the phaser offset
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0;
      for (var j = 8; j--; ) {
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // Gets the sample from the oscillator
        switch (_waveType) {
          case 0: // Square wave
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // Saw wave
            _sample = 1 - _phase / _periodTemp * 2;
            break;
          case 2: // Sine wave (fast and accurate approx)
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
            break;
          case 3: // Noise
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
        }

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0;
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1;
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

        _superSample += _sample;
      }

      // Averages out the super samples and applies volumes
      _superSample *= .125 * _envelopeVolume * _masterVolume;

      // Clipping if too loud
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
    }

    return length;
  }
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
window['jsfxr'] = function(settings) {
  // Initialize SfxrParams
  synth._params.setSettings(settings);
  // Synthesize Wave
  var envelopeFullLength = synth.totalReset();
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
  var dv = new Uint32Array(data.buffer, 0, 44);
  // Initialize header
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // put total size here
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // size of the following
  dv[5] = 0x00010001; // Mono: 1 channel, PCM format
  dv[6] = 0x0000AC44; // 44,100 samples per second
  dv[7] = 0x00015888; // byte rate: two bytes per sample
  dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // put number of samples here

  // Base64 encoding written by me, @maettig
  used += 44;
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,';
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
  }
  return output;
}