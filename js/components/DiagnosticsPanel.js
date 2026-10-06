/**
 * ASTRA-LINK — Fault Injection & Diagnostics Component
 */

export function DiagnosticsPanel({
  stateSnapshot,
  onUnlockSPL,
  onSimulateFailure,
  onRecover,
  onRunBrowserTests
}) {
  const { state, isBusy, canSimulateFailure, canRecover } = stateSnapshot;

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--mars-amber)' } }, '🛠'),
        'Fault Injection & Channel Resilience'
      ),
      React.createElement('span', { className: 'badge badge-warning' }, 'SIMULATED ANOMALIES')
    ),

    React.createElement('div', { style: { fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' } },
      'Test the resilience and fail-safe recovery behavior of the ASTRA-LINK architecture under controlled adverse channel conditions:'
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' } },
      // Fault 1: Unlock SPL
      React.createElement('div', { style: { padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: '#fbbf24' } },
          '1. Unlock Phase Synchronization (SPL)'
        ),
        React.createElement('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' } },
          'Induces quantum phase drift and elevates jitter. Simulates channel decoherence, safely blocking any new transmissions.'
        ),
        React.createElement('button', {
          className: 'btn btn-secondary',
          style: { width: '100%', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' },
          onClick: onUnlockSPL,
          disabled: isBusy || (state !== 'SYNCHRONIZED' && state !== 'DELIVERED')
        },
          'Simulate SPL Unlock 🔓'
        )
      ),

      // Fault 2: Throat Collapse
      React.createElement('div', { style: { padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: '#f87171' } },
          '2. Collapse ASTRA Throat Mid-Transit'
        ),
        React.createElement('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' } },
          'Collapses the hypothetical shortcut. Any in-flight packet is intercepted and marked as interrupted/failed.'
        ),
        React.createElement('button', {
          className: 'btn btn-danger',
          style: { width: '100%' },
          onClick: () => onSimulateFailure('Metric perturbation collapse / Throat severed'),
          disabled: isBusy || !canSimulateFailure
        },
          'Collapse Throat 💥'
        )
      ),

      // Recovery Action
      React.createElement('div', { style: { padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: '#34d399' } },
          '3. Automated Link Recovery'
        ),
        React.createElement('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' } },
          'Restores manifold geometry, realigns quantum reference frames, and re-locks SPL back to 99.8% coherence.'
        ),
        React.createElement('button', {
          className: 'btn btn-primary',
          style: { width: '100%' },
          onClick: onRecover,
          disabled: isBusy || !canRecover
        },
          'Restore Connection 🔄'
        )
      ),

      // In-Browser Test Suite Launcher
      React.createElement('div', { style: { padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--cyan-400)' } },
          '4. Automated Test Suite'
        ),
        React.createElement('div', { style: { fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' } },
          'Executes the full 20-criteria test suite directly in the browser to verify timing math, state transitions, and text fidelity.'
        ),
        React.createElement('button', {
          className: 'btn btn-secondary',
          style: { width: '100%', borderColor: 'var(--cyan-border)', color: 'var(--cyan-400)' },
          onClick: onRunBrowserTests
        },
          'Run Automated Tests 🧪'
        )
      )
    )
  );
}
