/**
 * Animation Engine for Flash 8
 * Handles playback of animations, frame management, and timing
 */

class AnimationEngine {
  constructor(frameRate = 24) {
    this.frameRate = frameRate;
    this.frameDuration = 1000 / frameRate; // ms per frame
    this.currentFrame = 1;
    this.totalFrames = 1;
    this.isPlaying = false;
    this.lastFrameTime = 0;
    this.animationId = null;
    this.onFrameChange = null;
  }

  /**
   * Start animation playback
   */
  play(onFrame) {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.onFrameChange = onFrame;
    this.lastFrameTime = performance.now();
    
    this.animate(performance.now());
  }

  /**
   * Stop animation playback
   */
  stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Internal animation loop
   */
  animate(currentTime) {
    if (!this.isPlaying) return;

    const deltaTime = currentTime - this.lastFrameTime;

    if (deltaTime >= this.frameDuration) {
      this.currentFrame++;
      
      // Loop animation
      if (this.currentFrame > this.totalFrames) {
        this.currentFrame = 1;
      }

      if (this.onFrameChange) {
        this.onFrameChange(this.currentFrame);
      }

      this.lastFrameTime = currentTime;
    }

    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  /**
   * Jump to specific frame
   */
  gotoFrame(frameNumber) {
    this.currentFrame = Math.max(1, Math.min(frameNumber, this.totalFrames));
    if (this.onFrameChange) {
      this.onFrameChange(this.currentFrame);
    }
  }

  /**
   * Next frame
   */
  nextFrame() {
    this.gotoFrame(this.currentFrame + 1);
  }

  /**
   * Previous frame
   */
  previousFrame() {
    this.gotoFrame(this.currentFrame - 1);
  }

  /**
   * Set animation properties
   */
  setFrameRate(fps) {
    this.frameRate = fps;
    this.frameDuration = 1000 / fps;
  }

  /**
   * Set total frame count
   */
  setTotalFrames(count) {
    this.totalFrames = Math.max(1, count);
    if (this.currentFrame > this.totalFrames) {
      this.currentFrame = this.totalFrames;
    }
  }

  /**
   * Get playback progress (0-1)
   */
  getProgress() {
    return this.totalFrames > 0 ? this.currentFrame / this.totalFrames : 0;
  }

  /**
   * Get current frame
   */
  getCurrentFrame() {
    return this.currentFrame;
  }

  /**
   * Check if playing
   */
  getIsPlaying() {
    return this.isPlaying;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationEngine;
}
