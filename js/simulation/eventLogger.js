/**
 * ASTRA-LINK — Telemetry & System Event Logger
 */

export const EVENT_CATEGORIES = {
  INFO: 'INFO',
  TRANSMIT: 'TRANSMIT',
  RECEIVE: 'RECEIVE',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  RECOVERY: 'RECOVERY'
};

let eventCounter = 0;

export function createEvent(category, message, details = null) {
  eventCounter++;
  const now = new Date();
  const timeFormatted = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  
  return {
    id: `evt-${Date.now()}-${eventCounter}`,
    sequence: eventCounter,
    timestamp: now.getTime(),
    timeFormatted,
    category: category || EVENT_CATEGORIES.INFO,
    message,
    details: details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null
  };
}

export class EventLogger {
  constructor(maxEvents = 200) {
    this.maxEvents = maxEvents;
    this.events = [];
    this.listeners = new Set();
  }

  log(category, message, details = null) {
    const event = createEvent(category, message, details);
    this.events.unshift(event); // newest first
    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }
    this.notify();
    return event;
  }

  info(msg, details) {
    return this.log(EVENT_CATEGORIES.INFO, msg, details);
  }

  transmit(msg, details) {
    return this.log(EVENT_CATEGORIES.TRANSMIT, msg, details);
  }

  receive(msg, details) {
    return this.log(EVENT_CATEGORIES.RECEIVE, msg, details);
  }

  warning(msg, details) {
    return this.log(EVENT_CATEGORIES.WARNING, msg, details);
  }

  error(msg, details) {
    return this.log(EVENT_CATEGORIES.ERROR, msg, details);
  }

  recovery(msg, details) {
    return this.log(EVENT_CATEGORIES.RECOVERY, msg, details);
  }

  getEvents(filterCategory = 'ALL') {
    if (!filterCategory || filterCategory === 'ALL') {
      return [...this.events];
    }
    return this.events.filter(e => e.category === filterCategory);
  }

  clear() {
    this.events = [];
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.events);
      } catch (err) {
        console.error('EventLogger listener error:', err);
      }
    }
  }
}
