/**
 * ASTRA-LINK — Conventional Light-Time Comparison Component
 */

import { DISTANCE_PRESETS, SPEED_OF_LIGHT_KMS } from '../simulation/simulationConstants.js';
import { compareLightTimeVsAstra } from '../simulation/timingCalculations.js';

export function TimingComparison({ shortcutDuration = 2.4 }) {
  const [distanceKm, setDistanceKm] = React.useState(328000000);
  const [activePresetId, setActivePresetId] = React.useState('current');

  const comparison = compareLightTimeVsAstra(distanceKm, shortcutDuration);

  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setDistanceKm(preset.distanceKm);
  };

  const handleCustomSlider = (val) => {
    setActivePresetId('custom');
    setDistanceKm(Number(val));
  };

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '⏱'),
        'Conventional Light-Time vs. ASTRA Shortcut Comparison'
      ),
      React.createElement('span', { className: 'badge badge-cyan' }, 'AEROSPACE METRICS')
    ),

    React.createElement('div', { className: 'comparison-calculator' },
      // Presets Row
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' } },
          'Select Earth–Mars Orbital Distance Preset:'
        ),
        React.createElement('div', { className: 'preset-buttons-row' },
          DISTANCE_PRESETS.map(p => {
            const isSelected = activePresetId === p.id;
            return React.createElement('button', {
              key: p.id,
              className: `preset-chip ${isSelected ? 'active' : ''}`,
              style: isSelected ? { background: 'rgba(6, 182, 212, 0.25)', borderColor: 'var(--cyan-neon)', color: '#fff' } : {},
              onClick: () => handleSelectPreset(p)
            },
              `${p.label} (${(p.distanceKm / 1e6).toFixed(1)}M km)`
            );
          })
        )
      ),

      // Custom Slider
      React.createElement('div', { style: { background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' } },
          React.createElement('span', { style: { color: 'var(--text-secondary)' } }, 'Interactive Distance Adjustment:'),
          React.createElement('strong', { style: { color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' } },
            `${(distanceKm / 1e6).toFixed(1)} Million km (${distanceKm.toLocaleString()} km)`
          )
        ),
        React.createElement('input', {
          type: 'range',
          min: 50000000,
          max: 410000000,
          step: 1000000,
          value: distanceKm,
          onChange: (e) => handleCustomSlider(e.target.value),
          style: { width: '100%', accentColor: 'var(--cyan-neon)', cursor: 'pointer' }
        }),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' } },
          React.createElement('span', null, '50M km (Perihelion)'),
          React.createElement('span', null, '410M km (Aphelion / Solar Conjunction)')
        )
      ),

      // Side-by-Side Comparison Cards
      React.createElement('div', { className: 'comparison-grid' },
        // Conventional Light Time Card
        React.createElement('div', { className: 'comparison-card' },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            React.createElement('span', { style: { fontSize: '0.78rem', color: 'var(--text-secondary)' } }, 'Conventional Electromagnetic Waves'),
            React.createElement('span', { className: 'badge badge-offline' }, 'c = 299,792 km/s')
          ),
          React.createElement('div', { className: 'metric-big-value', style: { color: '#94a3b8' } },
            comparison.formattedOneWay
          ),
          React.createElement('div', { className: 'metric-sub' },
            `One-Way Light Delay (Round-Trip: ${comparison.formattedRoundTrip})`
          ),
          React.createElement('div', { style: { marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } },
            `Formula: t = ${(distanceKm / 1e6).toFixed(1)}×10⁶ km ÷ ${SPEED_OF_LIGHT_KMS.toFixed(0)} km/s`
          )
        ),

        // ASTRA-LINK Shortcut Card
        React.createElement('div', { className: 'comparison-card highlight' },
          React.createElement('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            React.createElement('span', { style: { fontSize: '0.78rem', color: 'var(--cyan-400)' } }, 'ASTRA-LINK Hypothetical Shortcut'),
            React.createElement('span', { className: 'badge badge-cyan' }, 'Simulated Parameter')
          ),
          React.createElement('div', { className: 'metric-big-value' },
            comparison.formattedAstra
          ),
          React.createElement('div', { className: 'metric-sub' },
            `Illustrative Transit Duration (Difference: ${comparison.formattedDifference})`
          ),
          React.createElement('div', { style: { marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' } },
            comparison.ratio ? `Theoretical Ratio: ~${Math.round(comparison.ratio)}× software speedup` : 'Comparative software parameter'
          )
        )
      ),

      // Academic Disclosure
      React.createElement('div', { style: { fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '2px solid var(--cyan-border)', paddingLeft: '0.6rem' } },
        'DISCLAIMER: Conventional light-time is derived from physical astronomical distances and the speed of light in vacuum (c). The ASTRA shortcut transit duration is an illustrative software simulation parameter, not a measured physical quantity.'
      )
    )
  );
}
