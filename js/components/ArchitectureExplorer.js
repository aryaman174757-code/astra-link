/**
 * ASTRA-LINK — Architecture Explorer ("How ASTRA-LINK Works")
 * Displays the 8 conceptual modules, live active highlighting,
 * and academic explanations of each module's role.
 */

import { ARCHITECTURE_MODULES } from '../simulation/simulationConstants.js';

export function ArchitectureExplorer({ activeModuleId }) {
  const [selectedModuleId, setSelectedModuleId] = React.useState('astra_throat');

  const selectedModule = ARCHITECTURE_MODULES.find(m => m.id === selectedModuleId) || ARCHITECTURE_MODULES[4];

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '🧩'),
        'How ASTRA-LINK Works — Architecture Explorer'
      ),
      React.createElement('span', { className: 'badge badge-cyan' }, '8-MODULE PIPELINE')
    ),

    React.createElement('div', { style: { fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' } },
      'Select any conceptual module in the spacetime pipeline below to inspect its role and theoretical operational principles:'
    ),

    // Pipeline Cards
    React.createElement('div', { className: 'arch-pipeline-container' },
      ARCHITECTURE_MODULES.map((mod, index) => {
        const isCurrentActive = activeModuleId === mod.id;
        const isSelected = selectedModuleId === mod.id;

        return React.createElement('div', {
          key: mod.id,
          className: `arch-node-card ${isSelected ? 'selected' : ''} ${isCurrentActive ? 'active-stage' : ''}`,
          onClick: () => setSelectedModuleId(mod.id),
          style: isSelected ? { borderColor: 'var(--cyan-neon)', background: 'rgba(6, 182, 212, 0.15)' } : {}
        },
          React.createElement('div', { style: { fontSize: '0.65rem', color: isCurrentActive ? 'var(--cyan-neon)' : 'var(--text-muted)' } },
            `0${index + 1} • ${isCurrentActive ? 'TRANSMITTING' : 'IDLE'}`
          ),
          React.createElement('div', { className: 'arch-node-title', style: isSelected ? { color: 'var(--cyan-400)' } : {} },
            mod.shortName
          ),
          React.createElement('div', { className: 'arch-node-role' },
            mod.location.split(' ')[0]
          )
        );
      })
    ),

    // Selected Module Detail Card
    React.createElement('div', { className: 'arch-detail-box' },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' } },
        React.createElement('div', { style: { fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' } },
          selectedModule.name
        ),
        React.createElement('span', { className: 'badge badge-cyan' }, selectedModule.location)
      ),
      React.createElement('div', { style: { color: 'var(--text-secondary)', marginBottom: '0.6rem', lineHeight: '1.45' } },
        selectedModule.explanation
      ),
      React.createElement('div', { style: { padding: '0.5rem 0.75rem', background: 'rgba(3, 7, 18, 0.5)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' } },
        React.createElement('strong', { style: { color: 'var(--cyan-400)' } }, 'Operational Function: '),
        selectedModule.role
      ),
      React.createElement('div', { style: { marginTop: '0.5rem', fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' } },
        '* Conceptual module: represents software state abstractions in this simulation, not experimentally validated hardware.'
      )
    )
  );
}
