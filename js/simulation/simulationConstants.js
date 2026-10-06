/**
 * ASTRA-LINK — Adaptive Spacetime Transmission & Relayed Architecture
 * Simulation Constants and Definitions
 */

export const SIMULATION_STATES = {
  OFFLINE: 'OFFLINE',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  ESTABLISHING_SHORTCUT: 'ESTABLISHING_SHORTCUT',
  SHORTCUT_ESTABLISHED: 'SHORTCUT_ESTABLISHED',
  SPL_LOCKING: 'SPL_LOCKING',
  SYNCHRONIZED: 'SYNCHRONIZED',
  TRANSMITTING: 'TRANSMITTING',
  RECONSTRUCTING: 'RECONSTRUCTING',
  DELIVERED: 'DELIVERED',
  DEGRADED: 'DEGRADED',
  FAILED: 'FAILED',
  RECOVERING: 'RECOVERING'
};

export const SPEED_OF_LIGHT_KMS = 299792.458; // km/s in vacuum

export const TRANSMISSION_DIRECTIONS = {
  EARTH_TO_MARS: 'EARTH_TO_MARS',
  MARS_TO_EARTH: 'MARS_TO_EARTH'
};

export const DISTANCE_PRESETS = [
  {
    id: 'opposition',
    label: 'Closest Approach (Opposition)',
    distanceKm: 54600000,
    description: 'Orbital perihelion alignment (~54.6M km)'
  },
  {
    id: 'average',
    label: 'Mean Orbital Distance',
    distanceKm: 225000000,
    description: 'Average Earth-Mars distance (~225.0M km)'
  },
  {
    id: 'current',
    label: 'Simulation Reference Orbit',
    distanceKm: 328000000,
    description: 'Conceptual reference configuration (~328.0M km)'
  },
  {
    id: 'conjunction',
    label: 'Maximum Distance (Conjunction)',
    distanceKm: 401000000,
    description: 'Opposite sides of Sun (~401.0M km)'
  }
];

export const ARCHITECTURE_MODULES = [
  {
    id: 'earth_engine',
    name: 'Earth ASTRA Engine',
    shortName: 'Earth Gateway',
    location: 'Earth Ground Station & Orbital Array',
    role: 'Coordinates high-bandwidth ground uplinks, packet sequencing, and quantum buffer management for transmission.',
    explanation: 'The primary Earth-based control terminal. Encodes raw telemetry and data packets into the ASTRA architecture framework.'
  },
  {
    id: 'info_modulator',
    name: 'Information-State Modulator',
    shortName: 'Info Modulator',
    location: 'Gateway Subspace Emitter',
    role: 'Converts conventional binary bitstreams into multi-dimensional spacetime informational state matrices.',
    explanation: 'Translates standard digital message packets into theoretical informational state vectors compatible with the shortcut boundary.'
  },
  {
    id: 'spacetime_state',
    name: 'Spacetime Information State',
    shortName: 'Spacetime State',
    location: 'Ingress Interface Manifold',
    role: 'Maintains quantum phase coherence of the message package during transit through the non-Euclidean path.',
    explanation: 'A mathematical and physical representation of the message structured to resist decoherence across the shortcut topology.'
  },
  {
    id: 'shortcut_engine',
    name: 'Spacetime Shortcut Communication Engine',
    shortName: 'Shortcut Engine',
    location: 'Central Field Controller',
    role: 'Regulates energy geometry and field stability parameters required to maintain the conceptual communication path.',
    explanation: 'Controls field harmonics that sustain the throat geometry between planetary endpoints.'
  },
  {
    id: 'astra_throat',
    name: 'Hypothetical ASTRA Throat',
    shortName: 'ASTRA Throat',
    location: 'Intersite Spacetime Channel',
    role: 'The conceptual topological shortcut connecting Earth and Mars orbital coordinates.',
    explanation: 'The core visualization element — a theoretical conduit allowing instantaneous or microsecond-scale informational traversal.'
  },
  {
    id: 'spl_lock',
    name: 'Spacetime Phase Lock (SPL)',
    shortName: 'SPL Subsystem',
    location: 'Dual-Endpoint Synchronization Matrix',
    role: 'Synchronizes quantum reference clocks and spacetime phase alignment between Earth and Mars gateways.',
    explanation: 'Without SPL lock, informational packets cannot cross the boundary without total phase decoherence and data corruption.'
  },
  {
    id: 'mars_engine',
    name: 'Mars ASTRA Engine',
    shortName: 'Mars Gateway',
    location: 'Ares Prime Orbital Station',
    role: 'Captures arriving informational vectors at the Mars terminus and routes packets to surface transceivers.',
    explanation: 'The destination node at Mars. In reverse mode, serves as the transmission originator.'
  },
  {
    id: 'state_reconstructor',
    name: 'State Reconstruction Engine',
    shortName: 'Reconstruction Engine',
    location: 'Egress Decoding Buffer',
    role: 'Performs inverse unitary transformation and error-correcting state decoding to recover 100% exact text.',
    explanation: 'Decodes the spacetime state back into regular Unicode text and verifies cryptographic packet integrity.'
  }
];

export const HUMAN_STATUS_MESSAGES = {
  [SIMULATION_STATES.OFFLINE]: 'System is offline. Initialize endpoints to begin.',
  [SIMULATION_STATES.INITIALIZING]: 'Preparing Earth & Mars communication endpoints...',
  [SIMULATION_STATES.READY]: 'Endpoints initialized. Ready to establish hypothetical shortcut.',
  [SIMULATION_STATES.ESTABLISHING_SHORTCUT]: 'Establishing hypothetical spacetime shortcut tunnel...',
  [SIMULATION_STATES.SHORTCUT_ESTABLISHED]: 'Shortcut established. Spacetime Phase Lock (SPL) required.',
  [SIMULATION_STATES.SPL_LOCKING]: 'Synchronizing Spacetime Phase Lock (SPL) between Earth & Mars...',
  [SIMULATION_STATES.SYNCHRONIZED]: 'Link fully synchronized. Ready to send messages.',
  [SIMULATION_STATES.TRANSMITTING]: 'Transmitting informational packet through ASTRA shortcut...',
  [SIMULATION_STATES.RECONSTRUCTING]: 'Reconstructing informational state at destination gateway...',
  [SIMULATION_STATES.DELIVERED]: 'Message delivered successfully with 100% data fidelity.',
  [SIMULATION_STATES.DEGRADED]: 'Warning: Link degraded. Phase jitter detected on SPL channel.',
  [SIMULATION_STATES.FAILED]: 'Communication link interrupted! ASTRA throat collapsed.',
  [SIMULATION_STATES.RECOVERING]: 'Executing automated link recovery & re-stabilization sequence...'
};

export const SCIENTIFIC_DISCLAIMER = 
  "CONCEPTUAL SIMULATION — ASTRA-LINK visualizes a hypothetical spacetime communication architecture. " +
  "The proposed shortcut and synchronization mechanism have not been experimentally demonstrated. " +
  "Shortcut transmission times shown here are illustrative software parameters, not measured or predicted physical results.";
