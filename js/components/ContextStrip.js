/**
 * ASTRA-LINK — ContextStrip Component
 */

import { TRANSMISSION_DIRECTIONS } from '../simulation/simulationConstants.js';

export function ContextStrip({ stateSnapshot }) {
  const { humanStatus, direction, activeModuleId, state } = stateSnapshot;
  const isEarthToMars = direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;

  const nodes = isEarthToMars
    ? [
        { id: 'earth_engine', label: 'Earth Gateway' },
        { id: 'info_modulator', label: 'Info Modulator' },
        { id: 'astra_throat', label: 'ASTRA Throat' },
        { id: 'state_reconstructor', label: 'Reconstruction' },
        { id: 'mars_engine', label: 'Mars Gateway' }
      ]
    : [
        { id: 'mars_engine', label: 'Mars Gateway' },
        { id: 'info_modulator', label: 'Info Modulator' },
        { id: 'astra_throat', label: 'ASTRA Throat' },
        { id: 'state_reconstructor', label: 'Reconstruction' },
        { id: 'earth_engine', label: 'Earth Gateway' }
      ];

  return React.createElement('div', { className: 'context-strip' },
    // Status text
    React.createElement('div', { className: 'context-strip-status' },
      React.createElement('span', { className: 'status-dot active' }),
      React.createElement('span', { style: { fontWeight: 500, color: 'var(--text-primary)' } }, humanStatus)
    ),

    // Dynamic Route Pipeline Nodes
    React.createElement('div', { className: 'context-strip-pipeline' },
      nodes.map((node, index) => {
        const isActive = activeModuleId === node.id ||
          (node.id === 'astra_throat' && state === 'TRANSMITTING') ||
          (node.id === 'state_reconstructor' && state === 'RECONSTRUCTING');

        return React.createElement(React.Fragment, { key: node.id },
          React.createElement('div', {
            className: `pipeline-node ${isActive ? 'active' : ''}`,
            title: `Module: ${node.label}`
          },
            node.label
          ),
          index < nodes.length - 1 && React.createElement('span', { className: 'pipeline-arrow' }, '→')
        );
      })
    )
  );
}
