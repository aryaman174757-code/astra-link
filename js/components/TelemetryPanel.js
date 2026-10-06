/**
 * ASTRA-LINK — Telemetry & Channel Diagnostics Component
 */

export function TelemetryPanel({ stateSnapshot }) {
  const {
    state,
    splCoherence,
    signalToNoiseRatio,
    phaseJitter,
    deliveredCount,
    failedCount,
    totalTransmittedBytes
  } = stateSnapshot;

  const getChannelHealth = () => {
    if (state === 'FAILED') return { label: 'COLLAPSED / SEVERED', color: 'var(--status-error)' };
    if (state === 'DEGRADED') return { label: 'DEGRADED (PHASE JITTER)', color: 'var(--status-warning)' };
    if (state === 'SYNCHRONIZED' || state === 'TRANSMITTING' || state === 'DELIVERED') {
      return { label: 'NOMINAL / PHASE LOCKED', color: 'var(--status-success)' };
    }
    return { label: 'STANDBY / OFFLINE', color: 'var(--text-muted)' };
  };

  const health = getChannelHealth();

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '📊'),
        'Realtime Telemetry & Gateway Diagnostics'
      ),
      React.createElement('span', {
        className: 'badge',
        style: { background: 'rgba(15, 23, 42, 0.8)', color: health.color, border: `1px solid ${health.color}` }
      }, health.label)
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' } },
      // Metric 1: SPL Coherence
      React.createElement('div', { style: { padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, 'SPL Phase Coherence'),
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' } },
          `${splCoherence.toFixed(1)}%`
        ),
        React.createElement('div', { style: { width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', marginTop: '0.35rem', overflow: 'hidden' } },
          React.createElement('div', { style: { width: `${splCoherence}%`, height: '100%', background: 'var(--cyan-neon)' } })
        )
      ),

      // Metric 2: SNR
      React.createElement('div', { style: { padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, 'Signal-to-Noise (SNR)'),
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' } },
          `${signalToNoiseRatio.toFixed(1)} dB`
        ),
        React.createElement('div', { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' } },
          signalToNoiseRatio > 30 ? 'High Fidelity Link' : 'Sub-optimal SNR'
        )
      ),

      // Metric 3: Phase Jitter
      React.createElement('div', { style: { padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, 'Phase Drift Jitter'),
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 700, color: phaseJitter > 50 ? 'var(--status-warning)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' } },
          `${phaseJitter.toFixed(1)} ps`
        ),
        React.createElement('div', { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' } },
          phaseJitter < 5 ? 'Stable Lock' : 'Elevated Jitter'
        )
      ),

      // Metric 4: Messages Delivered
      React.createElement('div', { style: { padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, 'Delivered Packets'),
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-mono)' } },
          deliveredCount
        ),
        React.createElement('div', { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' } },
          '100% Verified Delivery'
        )
      ),

      // Metric 5: Failed / Interrupted
      React.createElement('div', { style: { padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, 'Interrupted Transits'),
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 700, color: failedCount > 0 ? 'var(--status-error)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' } },
          failedCount
        ),
        React.createElement('div', { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' } },
          failedCount === 0 ? 'Zero Loss' : 'Logged & Aborted'
        )
      ),

      // Metric 6: Total Payload
      React.createElement('div', { style: { padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { fontSize: '0.7rem', color: 'var(--text-muted)' } }, 'Transmitted Data'),
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' } },
          `${totalTransmittedBytes} B`
        ),
        React.createElement('div', { style: { fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' } },
          'UTF-8 Byte Stream'
        )
      )
    )
  );
}
