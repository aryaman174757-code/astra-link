/**
 * ASTRA-LINK — Primary 4-Step System Workflow Panel
 */

import { SIMULATION_STATES } from '../simulation/simulationConstants.js';

export function SystemPanel({
  stateSnapshot,
  onInitialize,
  onEstablishShortcut,
  onSynchronize,
  onFocusComposer
}) {
  const { state, isBusy } = stateSnapshot;

  // Step 1: Initialize System
  const isStep1Done = state !== SIMULATION_STATES.OFFLINE && state !== SIMULATION_STATES.INITIALIZING;
  const isStep1Active = state === SIMULATION_STATES.OFFLINE;
  const isStep1Busy = state === SIMULATION_STATES.INITIALIZING;

  // Step 2: Establish Shortcut
  const isStep2Done = [
    SIMULATION_STATES.SHORTCUT_ESTABLISHED,
    SIMULATION_STATES.SPL_LOCKING,
    SIMULATION_STATES.SYNCHRONIZED,
    SIMULATION_STATES.TRANSMITTING,
    SIMULATION_STATES.RECONSTRUCTING,
    SIMULATION_STATES.DELIVERED,
    SIMULATION_STATES.DEGRADED
  ].includes(state);
  const isStep2Active = state === SIMULATION_STATES.READY;
  const isStep2Busy = state === SIMULATION_STATES.ESTABLISHING_SHORTCUT;
  const isStep2Disabled = !isStep1Done || isStep2Done || isBusy;

  // Step 3: Synchronize Link (SPL)
  const isStep3Done = [
    SIMULATION_STATES.SYNCHRONIZED,
    SIMULATION_STATES.TRANSMITTING,
    SIMULATION_STATES.RECONSTRUCTING,
    SIMULATION_STATES.DELIVERED
  ].includes(state);
  const isStep3Active = state === SIMULATION_STATES.SHORTCUT_ESTABLISHED || state === SIMULATION_STATES.DEGRADED;
  const isStep3Busy = state === SIMULATION_STATES.SPL_LOCKING;
  const isStep3Disabled = (!isStep2Done && state !== SIMULATION_STATES.DEGRADED) || isStep3Done || isBusy;

  // Step 4: Send Message
  const isStep4Ready = state === SIMULATION_STATES.SYNCHRONIZED || state === SIMULATION_STATES.DELIVERED;
  const isStep4Busy = state === SIMULATION_STATES.TRANSMITTING || state === SIMULATION_STATES.RECONSTRUCTING;

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '⚡'),
        'System Initialization & Link Workflow'
      ),
      React.createElement('span', { className: 'badge badge-cyan' }, 'GUIDED SEQUENCE')
    ),

    React.createElement('div', { className: 'workflow-steps-grid' },
      // Step 1
      React.createElement('div', {
        className: `workflow-step-card ${isStep1Active ? 'active-ready' : ''} ${isStep1Done ? 'completed' : ''}`
      },
        React.createElement('div', {
          className: 'step-number-bubble',
          style: isStep1Done ? { background: 'var(--status-success)', color: '#fff', borderColor: 'transparent' } : {}
        }, isStep1Done ? '✓' : '1'),
        React.createElement('div', { className: 'step-card-content' },
          React.createElement('div', { className: 'step-card-header' },
            React.createElement('div', { className: 'step-card-title' }, 'Step 1 — Initialize Endpoints'),
            React.createElement('span', { className: `badge ${isStep1Done ? 'badge-success' : (isStep1Active ? 'badge-cyan' : 'badge-offline')}` },
              isStep1Done ? 'Online' : (isStep1Busy ? 'Initializing...' : 'Offline')
            )
          ),
          React.createElement('div', { className: 'step-card-desc' },
            'Power on Earth Ground Gateway and Mars Orbital Transceiver arrays to establish base telemetry diagnostics.'
          ),
          React.createElement('div', { className: 'step-card-actions' },
            React.createElement('button', {
              className: 'btn btn-primary',
              onClick: onInitialize,
              disabled: isStep1Done || isBusy,
              title: isStep1Done ? 'Endpoints are already online' : 'Initialize Earth and Mars communication endpoints'
            },
              isStep1Busy ? '⏳ Initializing...' : (isStep1Done ? 'Endpoints Active' : 'Initialize System')
            ),
            !isStep1Done && !isStep1Busy && React.createElement('span', { style: { fontSize: '0.72rem', color: 'var(--cyan-400)' } }, 'Next action')
          )
        )
      ),

      // Step 2
      React.createElement('div', {
        className: `workflow-step-card ${isStep2Active ? 'active-ready' : ''} ${isStep2Done ? 'completed' : ''} ${!isStep1Done && !isStep2Done ? 'disabled' : ''}`
      },
        React.createElement('div', {
          className: 'step-number-bubble',
          style: isStep2Done ? { background: 'var(--status-success)', color: '#fff', borderColor: 'transparent' } : {}
        }, isStep2Done ? '✓' : '2'),
        React.createElement('div', { className: 'step-card-content' },
          React.createElement('div', { className: 'step-card-header' },
            React.createElement('div', { className: 'step-card-title' }, 'Step 2 — Establish Shortcut'),
            React.createElement('span', { className: `badge ${isStep2Done ? 'badge-success' : (isStep2Active ? 'badge-cyan' : 'badge-offline')}` },
              isStep2Done ? 'Established' : (isStep2Busy ? 'Forming...' : 'Pending')
            )
          ),
          React.createElement('div', { className: 'step-card-desc' },
            'Form the hypothetical ASTRA Throat manifold connecting Earth and Mars orbital sectors.'
          ),
          React.createElement('div', { className: 'step-card-actions' },
            React.createElement('button', {
              className: 'btn btn-primary',
              onClick: onEstablishShortcut,
              disabled: isStep2Disabled,
              title: !isStep1Done ? 'Requires Step 1 (Initialize System)' : (isStep2Done ? 'Shortcut already established' : 'Deploy hypothetical spacetime shortcut')
            },
              isStep2Busy ? '🌀 Forming...' : (isStep2Done ? 'Shortcut Formed' : 'Establish Shortcut')
            ),
            isStep2Active && !isStep2Busy && React.createElement('span', { style: { fontSize: '0.72rem', color: 'var(--cyan-400)' } }, 'Ready to establish')
          )
        )
      ),

      // Step 3
      React.createElement('div', {
        className: `workflow-step-card ${isStep3Active ? 'active-ready' : ''} ${isStep3Done ? 'completed' : ''} ${!isStep2Done && !isStep3Done ? 'disabled' : ''}`
      },
        React.createElement('div', {
          className: 'step-number-bubble',
          style: isStep3Done ? { background: 'var(--status-success)', color: '#fff', borderColor: 'transparent' } : {}
        }, isStep3Done ? '✓' : '3'),
        React.createElement('div', { className: 'step-card-content' },
          React.createElement('div', { className: 'step-card-header' },
            React.createElement('div', { className: 'step-card-title' }, 'Step 3 — Synchronize Link (SPL Lock)'),
            React.createElement('span', { className: `badge ${isStep3Done ? 'badge-success' : (isStep3Active ? 'badge-warning' : 'badge-offline')}` },
              isStep3Done ? 'Synchronized (99.8%)' : (isStep3Busy ? 'Locking...' : 'Unlocked')
            )
          ),
          React.createElement('div', { className: 'step-card-desc' },
            'Synchronize quantum reference frames and Spacetime Phase Lock (SPL) to prevent informational decoherence.'
          ),
          React.createElement('div', { className: 'step-card-actions' },
            React.createElement('button', {
              className: 'btn btn-primary',
              onClick: onSynchronize,
              disabled: isStep3Disabled,
              title: !isStep2Done ? 'Requires Step 2 (Establish Shortcut)' : (isStep3Done ? 'Link is fully locked' : 'Synchronize Spacetime Phase Lock')
            },
              isStep3Busy ? '🔒 Locking SPL...' : (isStep3Done ? 'Phase Locked' : 'Synchronize SPL')
            ),
            isStep3Active && !isStep3Busy && React.createElement('span', { style: { fontSize: '0.72rem', color: 'var(--status-warning)' } }, 'Lock required')
          )
        )
      ),

      // Step 4
      React.createElement('div', {
        className: `workflow-step-card ${isStep4Ready ? 'active-ready' : ''} ${!isStep3Done ? 'disabled' : ''}`
      },
        React.createElement('div', {
          className: 'step-number-bubble',
          style: isStep4Ready ? { background: 'rgba(0, 240, 255, 0.2)', color: 'var(--cyan-neon)', borderColor: 'var(--cyan-border)' } : {}
        }, '4'),
        React.createElement('div', { className: 'step-card-content' },
          React.createElement('div', { className: 'step-card-header' },
            React.createElement('div', { className: 'step-card-title' }, 'Step 4 — Send Message'),
            React.createElement('span', { className: `badge ${isStep4Ready ? 'badge-success' : 'badge-offline'}` },
              isStep4Ready ? 'Ready to Send' : (isStep4Busy ? 'Transmitting' : 'Waiting for Lock')
            )
          ),
          React.createElement('div', { className: 'step-card-desc' },
            'Compose message packets in the transmission console. Transmission verifies exact 100% byte fidelity.'
          ),
          React.createElement('div', { className: 'step-card-actions' },
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: onFocusComposer,
              disabled: !isStep4Ready || isStep4Busy
            },
              'Go to Composer ✍'
            ),
            !isStep4Ready && React.createElement('span', { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, 'Requires completed steps 1-3')
          )
        )
      )
    )
  );
}
