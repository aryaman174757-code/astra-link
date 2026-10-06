/**
 * ASTRA-LINK — TopBar Component
 */

import { TRANSMISSION_DIRECTIONS } from '../simulation/simulationConstants.js';

export function TopBar({
  stateSnapshot,
  onSwitchDirection,
  onSetSpeed,
  onTogglePause,
  onReset,
  onStartDemo,
  isDemoActive,
  onOpenAbout
}) {
  const { state, direction, speed, isPaused, isBusy } = stateSnapshot;

  const isEarthToMars = direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;
  const directionText = isEarthToMars ? 'Earth → Mars' : 'Mars → Earth';

  return React.createElement('header', { className: 'topbar' },
    // Brand Section
    React.createElement('div', { className: 'brand-wrapper' },
      React.createElement('div', { className: 'brand-icon-box' },
        React.createElement('div', { className: 'brand-icon-orb' })
      ),
      React.createElement('div', null,
        React.createElement('div', { className: 'brand-title' },
          'ASTRA-LINK',
          React.createElement('span', { className: 'badge badge-cyan', style: { fontSize: '0.65rem' } }, 'v2.4 PROTOTYPE')
        ),
        React.createElement('div', { className: 'brand-subtitle' },
          'Adaptive Spacetime Transmission & Relayed Architecture'
        )
      )
    ),

    // Center Controls: Route Direction & Live State Badge
    React.createElement('div', { className: 'topbar-center' },
      React.createElement('button', {
        className: 'route-direction-pill',
        onClick: onSwitchDirection,
        disabled: isBusy,
        title: 'Click to reverse transmission orientation between Earth and Mars'
      },
        React.createElement('span', { style: { color: isEarthToMars ? 'var(--cyan-400)' : 'var(--mars-amber)' } }, '⇋ Route:'),
        React.createElement('strong', null, directionText)
      ),
      React.createElement('div', { className: `badge badge-${getStateBadgeClass(state)}` },
        React.createElement('span', { className: `status-dot ${getStatusDotClass(state)}` }),
        state
      )
    ),

    // Right Action Buttons
    React.createElement('div', { className: 'topbar-actions' },
      // Speed Selector
      React.createElement('select', {
        className: 'speed-select',
        value: speed,
        onChange: (e) => onSetSpeed(parseFloat(e.target.value)),
        title: 'Simulation Speed Multiplier'
      },
        React.createElement('option', { value: 0.5 }, '0.5x Speed'),
        React.createElement('option', { value: 1.0 }, '1.0x Speed'),
        React.createElement('option', { value: 2.0 }, '2.0x Speed')
      ),

      // Pause / Resume Button
      React.createElement('button', {
        className: `btn btn-secondary ${isPaused ? 'btn-mars' : ''}`,
        onClick: onTogglePause,
        title: isPaused ? 'Resume Simulation' : 'Pause Simulation'
      },
        isPaused ? '▶ Resume' : '⏸ Pause'
      ),

      // Guided Demo Button
      React.createElement('button', {
        className: `btn ${isDemoActive ? 'btn-mars' : 'btn-primary'}`,
        onClick: onStartDemo,
        title: 'Interactive Guided Tour for Faculty Demonstrations'
      },
        isDemoActive ? '🎯 Tour Active' : '✨ Guided Demo'
      ),

      // Reset Simulation Button
      React.createElement('button', {
        className: 'btn btn-secondary',
        onClick: onReset,
        title: 'Reset entire simulation state to OFFLINE'
      },
        '↺ Reset'
      ),

      // About / Disclaimer Button
      React.createElement('button', {
        className: 'btn btn-secondary',
        onClick: onOpenAbout,
        title: 'About ASTRA-LINK & Scientific Disclaimers'
      },
        'ℹ About'
      )
    )
  );
}

function getStateBadgeClass(state) {
  switch (state) {
    case 'SYNCHRONIZED':
    case 'DELIVERED':
      return 'success';
    case 'TRANSMITTING':
    case 'RECONSTRUCTING':
    case 'SPL_LOCKING':
    case 'ESTABLISHING_SHORTCUT':
      return 'cyan';
    case 'DEGRADED':
    case 'RECOVERING':
      return 'warning';
    case 'FAILED':
      return 'error';
    default:
      return 'offline';
  }
}

function getStatusDotClass(state) {
  switch (state) {
    case 'SYNCHRONIZED':
    case 'DELIVERED':
      return 'success';
    case 'TRANSMITTING':
    case 'RECONSTRUCTING':
    case 'SPL_LOCKING':
      return 'active';
    case 'DEGRADED':
    case 'RECOVERING':
      return 'warning';
    case 'FAILED':
      return 'error';
    default:
      return 'offline';
  }
}
