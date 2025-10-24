// Comprehensive Input System - Game Controllers, Touch, and iOS Support
export interface InputState {
  // Keyboard
  keys: { [key: string]: boolean };
  
  // Mouse
  mouse: {
    x: number;
    y: number;
    buttons: { [button: number]: boolean };
  };
  
  // Touch
  touch: {
    active: boolean;
    touches: Touch[];
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    deltaX: number;
    deltaY: number;
  };
  
  // Gamepad
  gamepad: {
    connected: boolean;
    index: number;
    buttons: { [button: number]: boolean };
    axes: { [axis: number]: number };
    lastButtons: { [button: number]: boolean };
  };
  
  // Device detection
  device: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    hasTouch: boolean;
    hasGamepad: boolean;
  };
}

export class InputSystem {
  private inputState: InputState;
  private canvas: HTMLCanvasElement | null = null;
  private callbacks: {
    onKeyDown?: (key: string) => void;
    onKeyUp?: (key: string) => void;
    onMouseMove?: (x: number, y: number) => void;
    onMouseDown?: (button: number, x: number, y: number) => void;
    onMouseUp?: (button: number, x: number, y: number) => void;
    onTouchStart?: (touch: Touch) => void;
    onTouchMove?: (touch: Touch) => void;
    onTouchEnd?: (touch: Touch) => void;
    onGamepadButton?: (button: number, pressed: boolean) => void;
    onGamepadAxis?: (axis: number, value: number) => void;
  } = {};
  
  private gamepadIndex: number = -1;
  private lastGamepadState: { [button: number]: boolean } = {};
  
  constructor() {
    this.inputState = {
      keys: {},
      mouse: { x: 0, y: 0, buttons: {} },
      touch: {
        active: false,
        touches: [],
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        deltaX: 0,
        deltaY: 0
      },
      gamepad: {
        connected: false,
        index: -1,
        buttons: {},
        axes: {},
        lastButtons: {}
      },
      device: this.detectDevice()
    };
    
    this.initializeEventListeners();
    this.initializeGamepadSupport();
    this.initializeTouchSupport();
  }
  
  private detectDevice() {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasGamepad = 'getGamepads' in navigator;
    
    return {
      isMobile: isMobile && !isTablet,
      isTablet,
      isDesktop: !isMobile,
      isIOS,
      isAndroid,
      hasTouch,
      hasGamepad
    };
  }
  
  private initializeEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.inputState.keys[e.code] = true;
      this.callbacks.onKeyDown?.(e.code);
    });
    
    document.addEventListener('keyup', (e) => {
      this.inputState.keys[e.code] = false;
      this.callbacks.onKeyUp?.(e.code);
    });
    
    // Mouse events
    document.addEventListener('mousemove', (e) => {
      this.inputState.mouse.x = e.clientX;
      this.inputState.mouse.y = e.clientY;
      this.callbacks.onMouseMove?.(e.clientX, e.clientY);
    });
    
    document.addEventListener('mousedown', (e) => {
      this.inputState.mouse.buttons[e.button] = true;
      this.callbacks.onMouseDown?.(e.button, e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', (e) => {
      this.inputState.mouse.buttons[e.button] = false;
      this.callbacks.onMouseUp?.(e.button, e.clientX, e.clientY);
    });
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  private initializeGamepadSupport() {
    if (!this.inputState.device.hasGamepad) return;
    
    // Gamepad connected
    window.addEventListener('gamepadconnected', (e) => {
      console.log('🎮 Gamepad connected:', e.gamepad.id);
      this.gamepadIndex = e.gamepad.index;
      this.inputState.gamepad.connected = true;
      this.inputState.gamepad.index = e.gamepad.index;
    });
    
    // Gamepad disconnected
    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('🎮 Gamepad disconnected:', e.gamepad.id);
      this.gamepadIndex = -1;
      this.inputState.gamepad.connected = false;
      this.inputState.gamepad.index = -1;
    });
  }
  
  private initializeTouchSupport() {
    if (!this.inputState.device.hasTouch) return;
    
    // Prevent default touch behaviors
    document.addEventListener('touchstart', (e) => {
      if (e.target === document.body || e.target === this.canvas) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (e.target === document.body || e.target === this.canvas) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
      if (e.target === document.body || e.target === this.canvas) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Add touch event listeners to canvas
    if (this.inputState.device.hasTouch) {
      canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
      canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
      canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
  }
  
  private handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    
    this.inputState.touch.active = true;
    this.inputState.touch.touches = Array.from(e.touches);
    this.inputState.touch.startX = touch.clientX;
    this.inputState.touch.startY = touch.clientY;
    this.inputState.touch.currentX = touch.clientX;
    this.inputState.touch.currentY = touch.clientY;
    
    this.callbacks.onTouchStart?.(touch);
  }
  
  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    
    this.inputState.touch.currentX = touch.clientX;
    this.inputState.touch.currentY = touch.clientY;
    this.inputState.touch.deltaX = this.inputState.touch.currentX - this.inputState.touch.startX;
    this.inputState.touch.deltaY = this.inputState.touch.currentY - this.inputState.touch.startY;
    
    this.callbacks.onTouchMove?.(touch);
  }
  
  private handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    this.inputState.touch.active = false;
    this.inputState.touch.touches = [];
    
    this.callbacks.onTouchEnd?.(touch);
  }
  
  update() {
    this.updateGamepad();
  }
  
  private updateGamepad() {
    if (!this.inputState.device.hasGamepad || this.gamepadIndex === -1) return;
    
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.gamepadIndex];
    
    if (!gamepad) {
      this.inputState.gamepad.connected = false;
      return;
    }
    
    this.inputState.gamepad.connected = true;
    
    // Update buttons
    gamepad.buttons.forEach((button, index) => {
      const wasPressed = this.lastGamepadState[index] || false;
      const isPressed = button.pressed;
      
      this.inputState.gamepad.buttons[index] = isPressed;
      this.inputState.gamepad.lastButtons[index] = isPressed;
      
      if (isPressed && !wasPressed) {
        this.callbacks.onGamepadButton?.(index, true);
      } else if (!isPressed && wasPressed) {
        this.callbacks.onGamepadButton?.(index, false);
      }
    });
    
    // Update axes
    gamepad.axes.forEach((axis, index) => {
      this.inputState.gamepad.axes[index] = axis;
      this.callbacks.onGamepadAxis?.(index, axis);
    });
  }
  
  // Input query methods
  isKeyPressed(key: string): boolean {
    return this.inputState.keys[key] || false;
  }
  
  isMouseButtonPressed(button: number): boolean {
    return this.inputState.mouse.buttons[button] || false;
  }
  
  isTouchActive(): boolean {
    return this.inputState.touch.active;
  }
  
  getTouchDelta(): { x: number; y: number } {
    return {
      x: this.inputState.touch.deltaX,
      y: this.inputState.touch.deltaY
    };
  }
  
  isGamepadButtonPressed(button: number): boolean {
    return this.inputState.gamepad.buttons[button] || false;
  }
  
  getGamepadAxis(axis: number): number {
    return this.inputState.gamepad.axes[axis] || 0;
  }
  
  isGamepadConnected(): boolean {
    return this.inputState.gamepad.connected;
  }
  
  // Movement input (works with keyboard, touch, and gamepad)
  getMovementInput(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    
    // Keyboard input
    if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) x -= 1;
    if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) x += 1;
    if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) y -= 1;
    if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) y += 1;
    
    // Gamepad input
    if (this.isGamepadConnected()) {
      const leftStickX = this.getGamepadAxis(0);
      const leftStickY = this.getGamepadAxis(1);
      
      if (Math.abs(leftStickX) > 0.1) x += leftStickX;
      if (Math.abs(leftStickY) > 0.1) y += leftStickY;
      
      // D-pad support
      if (this.isGamepadButtonPressed(14)) x -= 1; // D-pad left
      if (this.isGamepadButtonPressed(15)) x += 1; // D-pad right
      if (this.isGamepadButtonPressed(12)) y -= 1; // D-pad up
      if (this.isGamepadButtonPressed(13)) y += 1; // D-pad down
    }
    
    // Touch input (relative movement)
    if (this.isTouchActive()) {
      const touchDelta = this.getTouchDelta();
      const sensitivity = 0.01;
      x += touchDelta.x * sensitivity;
      y += touchDelta.y * sensitivity;
    }
    
    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }
    
    return { x, y };
  }
  
  // Shoot input (works with keyboard, mouse, touch, and gamepad)
  isShootPressed(): boolean {
    // Keyboard
    if (this.isKeyPressed('Space')) return true;
    
    // Mouse
    if (this.isMouseButtonPressed(0)) return true;
    
    // Touch (handled separately in touch callbacks)
    
    // Gamepad
    if (this.isGamepadConnected()) {
      // A button (Xbox) or Cross button (PlayStation)
      if (this.isGamepadButtonPressed(0)) return true;
      // Right trigger
      if (this.getGamepadAxis(5) > 0.5) return true;
    }
    
    return false;
  }
  
  // Pause input
  isPausePressed(): boolean {
    // Keyboard
    if (this.isKeyPressed('Escape')) return true;
    
    // Gamepad
    if (this.isGamepadConnected()) {
      // Start button
      if (this.isGamepadButtonPressed(9)) return true;
    }
    
    return false;
  }
  
  // Weapon switching
  getWeaponInput(): number | null {
    // Keyboard number keys
    for (let i = 1; i <= 6; i++) {
      if (this.isKeyPressed(`Digit${i}`)) return i - 1;
    }
    
    // Gamepad shoulder buttons
    if (this.isGamepadConnected()) {
      if (this.isGamepadButtonPressed(4)) return 0; // Left shoulder
      if (this.isGamepadButtonPressed(5)) return 1; // Right shoulder
    }
    
    return null;
  }
  
  // Callback setters
  setCallbacks(callbacks: Partial<typeof this.callbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
  
  // Get current input state
  getInputState(): InputState {
    return { ...this.inputState };
  }
  
  // iOS specific optimizations
  optimizeForIOS() {
    if (!this.inputState.device.isIOS) return;
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // Prevent pull-to-refresh
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  // Cleanup
  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleTouchMove);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    }
  }
}
