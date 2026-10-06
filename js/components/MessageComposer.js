/**
 * ASTRA-LINK — Message Composer & Transmission Result Component
 */

import { TRANSMISSION_DIRECTIONS } from '../simulation/simulationConstants.js';

export function MessageComposer({
  stateSnapshot,
  onSendMessage,
  onSwitchDirection
}) {
  const [message, setMessage] = React.useState('Hello Mars. This is an ASTRA-LINK simulation test from Earth.');
  const textareaRef = React.useRef(null);

  const {
    state,
    direction,
    isBusy,
    activeTransmission,
    lastDeliveryResult,
    canTransmit,
    shortcutDuration
  } = stateSnapshot;

  const isEarthToMars = direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;
  const sourceName = isEarthToMars ? 'Earth Gateway [Sector 01]' : 'Mars Gateway [Ares Prime]';
  const destName = isEarthToMars ? 'Mars Gateway [Ares Prime]' : 'Earth Gateway [Sector 01]';

  const isTransmitting = state === 'TRANSMITTING' || state === 'RECONSTRUCTING';

  const handleSend = () => {
    if (!message.trim() || !canTransmit || isBusy) return;
    onSendMessage(message);
  };

  const handleClear = () => {
    setMessage('');
    if (textareaRef.current) textareaRef.current.focus();
  };

  const setPreset = (text) => {
    setMessage(text);
  };

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '📡'),
        'Message Composer & Packet Verification'
      ),
      React.createElement('button', {
        className: 'btn btn-secondary',
        style: { padding: '0.2rem 0.6rem', fontSize: '0.72rem' },
        onClick: onSwitchDirection,
        disabled: isBusy || isTransmitting,
        title: 'Reverse transmission direction'
      }, '⇋ Reverse Direction')
    ),

    React.createElement('div', { className: 'composer-container' },
      // Route Direction Header
      React.createElement('div', { className: 'composer-direction-header' },
        React.createElement('div', null,
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Source: '),
          React.createElement('strong', { style: { color: isEarthToMars ? 'var(--cyan-400)' : 'var(--mars-amber)' } }, sourceName)
        ),
        React.createElement('span', { style: { color: 'var(--cyan-neon)' } }, '➔ ASTRA Throat ➔'),
        React.createElement('div', null,
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Destination: '),
          React.createElement('strong', { style: { color: isEarthToMars ? 'var(--mars-amber)' : 'var(--cyan-400)' } }, destName)
        )
      ),

      // Text Input
      React.createElement('textarea', {
        ref: textareaRef,
        id: 'composer-input',
        className: 'composer-textarea',
        placeholder: isEarthToMars ? 'Type a message to send to Mars...' : 'Type a message to send to Earth...',
        value: message,
        onChange: (e) => setMessage(e.target.value.substring(0, 500)),
        disabled: isTransmitting
      }),

      // Presets & Character Count
      React.createElement('div', { className: 'composer-footer' },
        React.createElement('div', { className: 'composer-presets' },
          React.createElement('span', { style: { fontSize: '0.72rem', alignSelf: 'center' } }, 'Presets:'),
          React.createElement('button', {
            className: 'preset-chip',
            onClick: () => setPreset('Hello Mars. This is an ASTRA-LINK simulation test from Earth.'),
            disabled: isTransmitting
          }, 'Demonstration Text'),
          React.createElement('button', {
            className: 'preset-chip',
            onClick: () => setPreset('ASTRA-LINK Telemetry: Metric curvature nominal. Phase coherence 99.8%.'),
            disabled: isTransmitting
          }, 'Telemetry Ping'),
          React.createElement('button', {
            className: 'preset-chip',
            onClick: () => setPreset('Deep space transmission: 🪐 Ares Base ⇋ Sector 01 [Ω = 1.042].'),
            disabled: isTransmitting
          }, 'Unicode & Emojis')
        ),
        React.createElement('div', null, `${message.length} / 500 chars`)
      ),

      // Buttons & Validation Warning
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' } },
        React.createElement('div', { style: { fontSize: '0.74rem', color: canTransmit ? 'var(--status-success)' : 'var(--status-warning)' } },
          canTransmit
            ? '✓ Gateway synchronized. Ready for transmission.'
            : '⚠ Complete Steps 1-3 to synchronize link before transmitting.'
        ),
        React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: handleClear,
            disabled: !message || isTransmitting
          }, 'Clear'),
          React.createElement('button', {
            id: 'send-message-btn',
            className: 'btn btn-primary',
            onClick: handleSend,
            disabled: !canTransmit || !message.trim() || isBusy || isTransmitting
          },
            isTransmitting ? 'Transmitting...' : 'Send Message 🚀'
          )
        )
      ),

      // Realtime Live Transmission Progress Bar (Active during transit)
      isTransmitting && activeTransmission && React.createElement('div', { className: 'transit-progress-box' },
        React.createElement('div', { className: 'transit-progress-header' },
          React.createElement('span', { style: { fontWeight: 600, color: 'var(--cyan-neon)' } },
            `Transmitting [${activeTransmission.id}]`
          ),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-accent)' } },
            `Stage: ${activeTransmission.stage} (${Math.round((activeTransmission.progress || 0) * 100)}%)`
          )
        ),
        React.createElement('div', { className: 'progress-track' },
          React.createElement('div', {
            className: 'progress-fill',
            style: { width: `${(activeTransmission.progress || 0) * 100}%` }
          })
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' } },
          React.createElement('span', null, `Source: ${activeTransmission.source}`),
          React.createElement('span', null, `Payload: ${activeTransmission.byteLength} Bytes`),
          React.createElement('span', null, `Est. Transit: ${shortcutDuration}s`)
        )
      ),

      // Delivery Confirmation Card (After delivery or failure)
      lastDeliveryResult && !isTransmitting && React.createElement('div', {
        className: `delivery-result-card ${lastDeliveryResult.success ? '' : 'failed'}`
      },
        React.createElement('div', { className: 'delivery-header' },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
            React.createElement('span', { style: { fontSize: '1.1rem' } }, lastDeliveryResult.success ? '✅' : '❌'),
            React.createElement('strong', { style: { color: lastDeliveryResult.success ? '#34d399' : '#f87171' } },
              lastDeliveryResult.success ? 'Transmission Delivered & Verified' : 'Transmission Interrupted / Failed'
            )
          ),
          React.createElement('span', { className: `badge ${lastDeliveryResult.success ? 'badge-success' : 'badge-error'}` },
            lastDeliveryResult.success ? '100% Byte Fidelity' : 'Interrupted'
          )
        ),

        // Display original & reconstructed message
        React.createElement('div', { style: { fontSize: '0.75rem', color: 'var(--text-secondary)' } },
          lastDeliveryResult.success ? 'Reconstructed Text at Receiving Gateway:' : 'Original Text (Not Delivered):'
        ),
        React.createElement('div', {
          className: 'reconstructed-message-box',
          style: lastDeliveryResult.success ? {} : { color: '#fca5a5' }
        },
          lastDeliveryResult.success ? lastDeliveryResult.reconstructedText : lastDeliveryResult.originalText
        ),

        // Metadata grid
        React.createElement('div', { className: 'reconstructed-meta' },
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'ID: '),
            lastDeliveryResult.id
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Seq: '),
            `#${lastDeliveryResult.sequence}`
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Size: '),
            `${lastDeliveryResult.byteLength} Bytes`
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Route: '),
            `${lastDeliveryResult.source} → ${lastDeliveryResult.destination}`
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Transit: '),
            lastDeliveryResult.success ? `${lastDeliveryResult.elapsedSeconds}s (ASTRA shortcut)` : 'Aborted'
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-muted)' } }, 'Time: '),
            lastDeliveryResult.timestamp
          )
        )
      )
    )
  );
}
