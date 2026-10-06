/**
 * ASTRA-LINK — About & Academic Disclaimer Modal
 */

import { SCIENTIFIC_DISCLAIMER } from '../simulation/simulationConstants.js';

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return React.createElement('div', { className: 'modal-overlay', style: { zIndex: 110 } },
    React.createElement('div', { className: 'modal-content' },
      // Header
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' } },
        React.createElement('div', null,
          React.createElement('h2', { style: { fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.2rem' } },
            'About ASTRA-LINK'
          ),
          React.createElement('div', { style: { fontSize: '0.75rem', color: 'var(--cyan-400)' } },
            'Adaptive Spacetime Transmission & Relayed Architecture'
          )
        ),
        React.createElement('button', {
          className: 'btn btn-secondary',
          style: { padding: '0.25rem 0.6rem' },
          onClick: onClose
        }, '✕ Close')
      ),

      // Disclaimer Banner
      React.createElement('div', {
        style: {
          padding: '0.85rem',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid var(--cyan-border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          color: 'var(--cyan-400)',
          lineHeight: '1.5'
        }
      },
        React.createElement('strong', null, 'ACADEMIC & SCIENTIFIC DISCLAIMER:'),
        React.createElement('p', { style: { marginTop: '0.4rem', color: 'var(--text-secondary)' } },
          SCIENTIFIC_DISCLAIMER
        )
      ),

      // Content Sections
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' } },
        React.createElement('div', null,
          React.createElement('h4', { style: { color: 'var(--text-primary)', marginBottom: '0.35rem' } }, '1. Project Purpose & Scope'),
          React.createElement('p', null,
            'ASTRA-LINK is an interactive aerospace scientific simulation prototype designed to explore a hypothetical communication architecture between Earth and Mars. It provides an engineering demonstration of how theoretical spacetime shortcuts would manage information modulation, packet framing, reference frame synchronization, and fail-safe recovery.'
          )
        ),

        React.createElement('div', null,
          React.createElement('h4', { style: { color: 'var(--text-primary)', marginBottom: '0.35rem' } }, '2. Spacetime Phase Lock (SPL)'),
          React.createElement('p', null,
            'In the proposed conceptual architecture, information packets traversing non-Euclidean shortcuts face total decoherence without strict quantum clock synchronization. The simulated Spacetime Phase Lock (SPL) must maintain at least 99.0% coherence between Earth and Mars gateway nodes to allow data transmission.'
          )
        ),

        React.createElement('div', null,
          React.createElement('h4', { style: { color: 'var(--text-primary)', marginBottom: '0.35rem' } }, '3. Conventional Light-Time Comparison'),
          React.createElement('p', null,
            'Under standard general relativity and electromagnetism, radio signals travel at the vacuum speed of light (c = 299,792.458 km/s). At typical orbital separations (54.6M to 401M km), signals experience between 3.0 to 22.3 minutes of one-way latency. ASTRA-LINK visualizes these physical constraints alongside illustrative software parameters.'
          )
        ),

        React.createElement('div', null,
          React.createElement('h4', { style: { color: 'var(--text-primary)', marginBottom: '0.35rem' } }, '4. Client-Side Engineering & Zero-Cost Architecture'),
          React.createElement('p', null,
            'The entire simulation executes locally with client-side state machines, procedural WebGL 3D rendering with Three.js, and zero paid API dependencies.'
          )
        )
      ),

      // Close Footer
      React.createElement('div', { style: { marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' } },
        React.createElement('button', {
          className: 'btn btn-primary',
          onClick: onClose
        }, 'Acknowledge & Return to Simulation')
      )
    )
  );
}
