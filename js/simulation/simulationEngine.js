/**
 * ASTRA-LINK — Centralized Simulation State Engine
 * Manages the state machine, asynchronous pipeline transitions,
 * message transmission, failure injection, recovery, and telemetry.
 */

import {
  SIMULATION_STATES,
  TRANSMISSION_DIRECTIONS,
  HUMAN_STATUS_MESSAGES,
  ARCHITECTURE_MODULES
} from './simulationConstants.js';
import { EventLogger } from './eventLogger.js';

export class SimulationEngine {
  constructor(options = {}) {
    this.state = SIMULATION_STATES.OFFLINE;
    this.direction = TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;
    this.speed = 1.0;
    this.isPaused = false;
    this.logger = options.logger || new EventLogger();

    // Telemetry & metrics
    this.deliveredCount = 0;
    this.failedCount = 0;
    this.totalTransmittedBytes = 0;
    this.shortcutDuration = 2.4; // illustrative seconds at 1x
    this.currentTransitProgress = 0; // 0 to 1
    this.activeModuleId = null;

    // Current & previous transmission data
    this.activeTransmission = null;
    this.lastDeliveryResult = null;

    // Signal / physical channel metrics
    this.splCoherence = 0.0; // 0% to 100%
    this.signalToNoiseRatio = 0.0; // dB
    this.phaseJitter = 0.0; // picoseconds

    // Internal timers & tokens
    this.activeOperationToken = 0;
    this.isBusy = false;
    this.listeners = new Set();

    this.logger.info('ASTRA-LINK simulation engine initialized. State: OFFLINE.');
  }

  // --- State Subscription & Notification ---
  subscribe(listener) {
    this.listeners.add(listener);
    // Initial emit
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('SimulationEngine notification error:', err);
      }
    }
  }

  getSnapshot() {
    return {
      state: this.state,
      direction: this.direction,
      speed: this.speed,
      isPaused: this.isPaused,
      isBusy: this.isBusy,
      humanStatus: HUMAN_STATUS_MESSAGES[this.state] || this.state,
      deliveredCount: this.deliveredCount,
      failedCount: this.failedCount,
      totalTransmittedBytes: this.totalTransmittedBytes,
      shortcutDuration: this.shortcutDuration,
      currentTransitProgress: this.currentTransitProgress,
      activeModuleId: this.activeModuleId,
      activeTransmission: this.activeTransmission ? { ...this.activeTransmission } : null,
      lastDeliveryResult: this.lastDeliveryResult ? { ...this.lastDeliveryResult } : null,
      splCoherence: this.splCoherence,
      signalToNoiseRatio: this.signalToNoiseRatio,
      phaseJitter: this.phaseJitter,
      canInitialize: this.state === SIMULATION_STATES.OFFLINE && !this.isBusy,
      canEstablishShortcut: (this.state === SIMULATION_STATES.READY || this.state === SIMULATION_STATES.OFFLINE) && !this.isBusy,
      canSynchronize: (this.state === SIMULATION_STATES.SHORTCUT_ESTABLISHED || this.state === SIMULATION_STATES.DEGRADED) && !this.isBusy,
      canTransmit: (this.state === SIMULATION_STATES.SYNCHRONIZED || this.state === SIMULATION_STATES.DELIVERED) && !this.isBusy,
      canSimulateFailure: (this.state === SIMULATION_STATES.SYNCHRONIZED || this.state === SIMULATION_STATES.TRANSMITTING || this.state === SIMULATION_STATES.DELIVERED),
      canRecover: (this.state === SIMULATION_STATES.FAILED || this.state === SIMULATION_STATES.DEGRADED) && !this.isBusy
    };
  }

  // --- Asynchronous Timer Helper with Cancellation ---
  _sleep(ms, token) {
    const adjustedMs = Math.max(10, ms / this.speed);
    return new Promise((resolve, reject) => {
      let elapsed = 0;
      const interval = 50;
      const timer = setInterval(() => {
        if (token !== this.activeOperationToken) {
          clearInterval(timer);
          reject(new Error('OPERATION_CANCELLED'));
          return;
        }
        if (!this.isPaused) {
          elapsed += interval;
          if (elapsed >= adjustedMs) {
            clearInterval(timer);
            resolve();
          }
        }
      }, interval);
    });
  }

  // --- Step 1: Initialize System ---
  async initializeSystem() {
    if (this.isBusy) return false;
    if (this.state !== SIMULATION_STATES.OFFLINE) {
      this.logger.warning('System initialization skipped: already initialized.');
      return false;
    }

    const token = ++this.activeOperationToken;
    this.isBusy = true;
    this.state = SIMULATION_STATES.INITIALIZING;
    this.activeModuleId = 'earth_engine';
    this.logger.info('Initializing Earth and Mars endpoints & diagnostic telemetry...');
    this.notify();

    try {
      await this._sleep(600, token);
      this.activeModuleId = 'mars_engine';
      this.splCoherence = 15.0;
      this.signalToNoiseRatio = 12.4;
      this.phaseJitter = 142.0;
      this.notify();

      await this._sleep(600, token);
      this.state = SIMULATION_STATES.READY;
      this.activeModuleId = null;
      this.logger.info('Endpoints online. Earth Gateway and Mars Gateway ready for shortcut deployment.');
      this.isBusy = false;
      this.notify();
      return true;
    } catch (err) {
      if (err.message !== 'OPERATION_CANCELLED') {
        console.error('Initialization error:', err);
      }
      this.isBusy = false;
      return false;
    }
  }

  // --- Step 2: Establish Shortcut ---
  async establishShortcut() {
    if (this.isBusy) return false;
    if (this.state === SIMULATION_STATES.OFFLINE) {
      await this.initializeSystem();
    }
    if (this.state !== SIMULATION_STATES.READY && this.state !== SIMULATION_STATES.OFFLINE) {
      this.logger.warning(`Cannot establish shortcut from current state: ${this.state}`);
      return false;
    }

    const token = ++this.activeOperationToken;
    this.isBusy = true;
    this.state = SIMULATION_STATES.ESTABLISHING_SHORTCUT;
    this.activeModuleId = 'shortcut_engine';
    this.logger.info('Initiating conceptual spacetime metric perturbation to form ASTRA Throat...');
    this.notify();

    try {
      await this._sleep(900, token);
      this.activeModuleId = 'astra_throat';
      this.splCoherence = 45.0;
      this.signalToNoiseRatio = 24.8;
      this.phaseJitter = 65.0;
      this.logger.info('ASTRA Throat manifold forming between Earth orbital and Mars orbital sectors.');
      this.notify();

      await this._sleep(900, token);
      this.state = SIMULATION_STATES.SHORTCUT_ESTABLISHED;
      this.activeModuleId = null;
      this.logger.info('Hypothetical ASTRA Throat formed. Spacetime Phase Lock (SPL) synchronization required.');
      this.isBusy = false;
      this.notify();
      return true;
    } catch (err) {
      if (err.message !== 'OPERATION_CANCELLED') {
        console.error('Establish shortcut error:', err);
      }
      this.isBusy = false;
      return false;
    }
  }

  // --- Step 3: Synchronize Link (SPL Lock) ---
  async synchronizeSPL() {
    if (this.isBusy) return false;
    if (this.state !== SIMULATION_STATES.SHORTCUT_ESTABLISHED && this.state !== SIMULATION_STATES.DEGRADED) {
      this.logger.warning(`Cannot lock SPL: current state is ${this.state}`);
      return false;
    }

    const token = ++this.activeOperationToken;
    this.isBusy = true;
    this.state = SIMULATION_STATES.SPL_LOCKING;
    this.activeModuleId = 'spl_lock';
    this.logger.info('Aligning quantum phase references & Spacetime Phase Lock (SPL)...');
    this.notify();

    try {
      // Phase 1 alignment
      await this._sleep(750, token);
      this.splCoherence = 82.5;
      this.signalToNoiseRatio = 38.2;
      this.phaseJitter = 12.4;
      this.logger.info('SPL phase alignment reached 82.5%. Locking reference carriers...');
      this.notify();

      // Phase 2 final lock
      await this._sleep(750, token);
      this.state = SIMULATION_STATES.SYNCHRONIZED;
      this.splCoherence = 99.8;
      this.signalToNoiseRatio = 46.5;
      this.phaseJitter = 0.8;
      this.activeModuleId = null;
      this.logger.info('Spacetime Phase Lock (SPL) fully synchronized at 99.8% coherence. Transmission enabled.');
      this.isBusy = false;
      this.notify();
      return true;
    } catch (err) {
      if (err.message !== 'OPERATION_CANCELLED') {
        console.error('SPL synchronization error:', err);
      }
      this.isBusy = false;
      return false;
    }
  }

  // Unlock SPL (simulate degradation)
  unlockSPL() {
    if (this.state !== SIMULATION_STATES.SYNCHRONIZED && this.state !== SIMULATION_STATES.DELIVERED) {
      return false;
    }
    this.activeOperationToken++;
    this.state = SIMULATION_STATES.DEGRADED;
    this.splCoherence = 34.2;
    this.signalToNoiseRatio = 14.1;
    this.phaseJitter = 85.0;
    this.activeModuleId = 'spl_lock';
    this.logger.warning('Spacetime Phase Lock (SPL) manually unlocked. Phase jitter elevated, transmissions locked.');
    this.notify();
    return true;
  }

  // Toggle transmission direction
  setDirection(direction) {
    if (this.isBusy) return false;
    this.direction = direction;
    this.logger.info(`Transmission route orientation switched: ${this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS ? 'Earth → Mars' : 'Mars → Earth'}`);
    this.notify();
    return true;
  }

  switchDirection() {
    const nextDir = this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS
      ? TRANSMISSION_DIRECTIONS.MARS_TO_EARTH
      : TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;
    return this.setDirection(nextDir);
  }

  // Set simulation speed
  setSpeed(speed) {
    this.speed = Math.max(0.25, Math.min(4.0, speed));
    this.logger.info(`Simulation speed multiplier set to ${this.speed}x`);
    this.notify();
  }

  // Pause / Resume
  togglePause() {
    this.isPaused = !this.isPaused;
    this.logger.info(`Simulation ${this.isPaused ? 'PAUSED' : 'RESUMED'}.`);
    this.notify();
    return this.isPaused;
  }

  // --- Step 4: Send Message (Complete 15-Stage Transmission Pipeline) ---
  async sendMessage(rawMessage) {
    if (this.isBusy) {
      this.logger.warning('Transmission rejected: system is currently busy.');
      return { success: false, reason: 'SYSTEM_BUSY' };
    }

    if (this.state !== SIMULATION_STATES.SYNCHRONIZED && this.state !== SIMULATION_STATES.DELIVERED) {
      const reason = this.state === SIMULATION_STATES.OFFLINE
        ? 'System is offline. Complete setup steps 1-3 first.'
        : this.state === SIMULATION_STATES.DEGRADED
        ? 'Spacetime Phase Lock (SPL) is unlocked. Synchronize link first.'
        : `System is in ${this.state} state. Transmission requires SYNCHRONIZED state.`;
      this.logger.error(`Transmission blocked: ${reason}`);
      return { success: false, reason };
    }

    // Validation
    const message = (rawMessage || '').trim();
    if (!message) {
      this.logger.warning('Transmission rejected: message cannot be empty.');
      return { success: false, reason: 'EMPTY_MESSAGE' };
    }
    if (message.length > 500) {
      this.logger.warning('Transmission rejected: message exceeds maximum length of 500 characters.');
      return { success: false, reason: 'MESSAGE_TOO_LONG' };
    }

    const token = ++this.activeOperationToken;
    this.isBusy = true;
    this.state = SIMULATION_STATES.TRANSMITTING;
    this.currentTransitProgress = 0;

    const source = this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS ? 'Earth Gateway' : 'Mars Gateway';
    const destination = this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS ? 'Mars Gateway' : 'Earth Gateway';
    const messageId = `ASTRA-PKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const sequenceNumber = this.deliveredCount + this.failedCount + 1;
    const byteLength = new TextEncoder().encode(message).length;

    this.activeTransmission = {
      id: messageId,
      sequence: sequenceNumber,
      source,
      destination,
      originalText: message,
      reconstructedText: null,
      byteLength,
      startTime: Date.now(),
      stage: 'MODULATION',
      progress: 0.0
    };

    this.logger.transmit(`Initiating transmission [Seq #${sequenceNumber} | ${byteLength} B]: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}" from ${source} to ${destination}`);
    this.notify();

    try {
      // Stage 1 & 2: Modulation & Spacetime Information State
      this.activeModuleId = this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS ? 'earth_engine' : 'mars_engine';
      this.activeTransmission.stage = 'MODULATION';
      this.activeTransmission.progress = 0.1;
      this.notify();
      await this._sleep(350, token);

      this.activeModuleId = 'info_modulator';
      this.activeTransmission.stage = 'SPACETIME_ENCODING';
      this.activeTransmission.progress = 0.2;
      this.notify();
      await this._sleep(350, token);

      this.activeModuleId = 'spacetime_state';
      this.activeTransmission.stage = 'THROAT_INGRESS';
      this.activeTransmission.progress = 0.3;
      this.notify();
      await this._sleep(300, token);

      // Stage 3 & 4: Ingress and Transit through ASTRA Throat
      this.activeModuleId = 'astra_throat';
      this.activeTransmission.stage = 'THROAT_TRANSIT';

      // Animate progress smoothly across transit
      const transitSteps = 10;
      const stepDuration = (this.shortcutDuration * 1000) / transitSteps;
      for (let i = 1; i <= transitSteps; i++) {
        await this._sleep(stepDuration, token);
        const progressFrac = 0.3 + (i / transitSteps) * 0.45; // up to 0.75
        this.currentTransitProgress = i / transitSteps;
        this.activeTransmission.progress = progressFrac;
        this.notify();
      }

      // Stage 5 & 6: Egress & State Reconstruction Engine
      this.state = SIMULATION_STATES.RECONSTRUCTING;
      this.activeModuleId = 'state_reconstructor';
      this.activeTransmission.stage = 'RECONSTRUCTION';
      this.activeTransmission.progress = 0.85;
      this.logger.receive(`Packet egressed at ${destination}. Decoding spacetime informational matrix...`);
      this.notify();
      await this._sleep(450, token);

      // Stage 7: Exact Reconstruction & Verification
      // Guarantee exact 100% byte fidelity
      const reconstructedText = message; // Perfect reconstruction preserved
      const fidelityCheck = (reconstructedText === message);

      if (!fidelityCheck) {
        throw new Error('FIDELITY_CHECK_FAILED');
      }

      this.activeTransmission.reconstructedText = reconstructedText;
      this.activeTransmission.progress = 1.0;
      this.activeTransmission.stage = 'VERIFIED';
      this.activeTransmission.endTime = Date.now();
      const elapsedMs = this.activeTransmission.endTime - this.activeTransmission.startTime;

      // Stage 8: Delivery Confirmation
      this.state = SIMULATION_STATES.DELIVERED;
      this.activeModuleId = this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS ? 'mars_engine' : 'earth_engine';
      this.deliveredCount++;
      this.totalTransmittedBytes += byteLength;

      this.lastDeliveryResult = {
        success: true,
        id: messageId,
        sequence: sequenceNumber,
        source,
        destination,
        originalText: message,
        reconstructedText: reconstructedText,
        byteLength,
        elapsedSeconds: (elapsedMs / 1000).toFixed(2),
        fidelity: '100% Exact Match',
        timestamp: new Date().toLocaleTimeString()
      };

      this.logger.receive(`Message [Seq #${sequenceNumber}] successfully delivered to ${destination} with 100% byte fidelity in ${(elapsedMs / 1000).toFixed(2)}s.`);
      this.isBusy = false;
      this.currentTransitProgress = 1.0;
      this.notify();

      // Return to synchronized idle after brief delivery spotlight
      setTimeout(() => {
        if (this.state === SIMULATION_STATES.DELIVERED && token === this.activeOperationToken) {
          this.state = SIMULATION_STATES.SYNCHRONIZED;
          this.activeModuleId = null;
          this.currentTransitProgress = 0;
          this.notify();
        }
      }, 2500 / this.speed);

      return { success: true, result: this.lastDeliveryResult };

    } catch (err) {
      if (err.message === 'OPERATION_CANCELLED') {
        this.isBusy = false;
        return { success: false, reason: 'CANCELLED' };
      }

      // Handle mid-transmission failure / fault injection
      this.failedCount++;
      this.state = SIMULATION_STATES.FAILED;
      this.activeModuleId = null;
      this.currentTransitProgress = 0;
      const failureReason = err.message === 'SIMULATED_FAILURE' ? 'Simulated throat collapse / phase decoherence' : err.message;

      this.lastDeliveryResult = {
        success: false,
        id: messageId,
        sequence: sequenceNumber,
        source,
        destination,
        originalText: message,
        reconstructedText: null,
        byteLength,
        error: failureReason,
        timestamp: new Date().toLocaleTimeString()
      };

      this.logger.error(`Transmission [Seq #${sequenceNumber}] FAILED: ${failureReason}. Message interrupted.`);
      this.isBusy = false;
      this.notify();
      return { success: false, reason: failureReason };
    }
  }

  // --- Fault Injection: Simulate Failure ---
  simulateFailure(reason = 'Metric perturbation collapse') {
    this.activeOperationToken++;
    this.state = SIMULATION_STATES.FAILED;
    this.isBusy = false;
    this.splCoherence = 0.0;
    this.signalToNoiseRatio = 2.1;
    this.phaseJitter = 450.0;
    this.activeModuleId = 'astra_throat';
    this.currentTransitProgress = 0;

    if (this.activeTransmission && this.activeTransmission.stage !== 'VERIFIED') {
      this.failedCount++;
      this.lastDeliveryResult = {
        success: false,
        id: this.activeTransmission.id,
        sequence: this.activeTransmission.sequence,
        source: this.activeTransmission.source,
        destination: this.activeTransmission.destination,
        originalText: this.activeTransmission.originalText,
        reconstructedText: null,
        error: reason,
        timestamp: new Date().toLocaleTimeString()
      };
      this.logger.error(`Transmission #${this.activeTransmission.sequence} ABORTED: ${reason}.`);
      this.activeTransmission = null;
    }

    this.logger.error(`FAULT INJECTED: ${reason}. ASTRA Throat collapsed, SPL lost.`);
    this.notify();
    return true;
  }

  // --- Automated Link Recovery ---
  async recoverConnection() {
    if (this.isBusy) return false;
    if (this.state !== SIMULATION_STATES.FAILED && this.state !== SIMULATION_STATES.DEGRADED) {
      this.logger.info('System is not in a failed or degraded state; recovery unneeded.');
      return false;
    }

    const token = ++this.activeOperationToken;
    this.isBusy = true;
    this.state = SIMULATION_STATES.RECOVERING;
    this.activeModuleId = 'shortcut_engine';
    this.logger.recovery('Initiating automated link recovery and resonance restabilization...');
    this.notify();

    try {
      // Step 1: Restabilize Throat geometry
      await this._sleep(800, token);
      this.activeModuleId = 'astra_throat';
      this.splCoherence = 55.0;
      this.signalToNoiseRatio = 28.0;
      this.phaseJitter = 45.0;
      this.logger.recovery('Spacetime manifold geometry restored. Initiating Phase Lock realignment...');
      this.notify();

      // Step 2: Re-lock SPL
      await this._sleep(900, token);
      this.activeModuleId = 'spl_lock';
      this.splCoherence = 99.8;
      this.signalToNoiseRatio = 46.2;
      this.phaseJitter = 0.9;
      this.state = SIMULATION_STATES.SYNCHRONIZED;
      this.activeModuleId = null;
      this.isBusy = false;
      this.logger.recovery('Link recovery complete! ASTRA Throat stable and SPL synchronized.');
      this.notify();
      return true;
    } catch (err) {
      if (err.message !== 'OPERATION_CANCELLED') {
        console.error('Recovery error:', err);
      }
      this.isBusy = false;
      return false;
    }
  }

  // --- Reset Entire Simulation ---
  resetSimulation() {
    // Invalidate any ongoing asynchronous operation
    this.activeOperationToken++;
    this.isBusy = false;
    this.isPaused = false;
    this.state = SIMULATION_STATES.OFFLINE;
    this.direction = TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;
    this.activeModuleId = null;
    this.activeTransmission = null;
    this.lastDeliveryResult = null;
    this.currentTransitProgress = 0;
    this.splCoherence = 0.0;
    this.signalToNoiseRatio = 0.0;
    this.phaseJitter = 0.0;

    this.logger.info('Simulation reset to initial OFFLINE state. All pending buffers cleared.');
    this.notify();
    return true;
  }
}
