/**
 * ASTRA-LINK — Event Log Panel Component
 */

import { EVENT_CATEGORIES } from '../simulation/eventLogger.js';

export function EventLogPanel({ events, onClearLog }) {
  const [filter, setFilter] = React.useState('ALL');

  const filteredEvents = filter === 'ALL'
    ? events
    : events.filter(e => e.category === filter);

  return React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
    React.createElement('div', { className: 'panel-section-title' },
      React.createElement('div', { className: 'panel-title' },
        React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '📜'),
        'System Event Log & State Audit'
      ),
      React.createElement('button', {
        className: 'btn btn-secondary',
        style: { padding: '0.2rem 0.6rem', fontSize: '0.72rem' },
        onClick: onClearLog,
        title: 'Clear event log history'
      }, 'Clear Log')
    ),

    // Filter Badges Row
    React.createElement('div', { style: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' } },
      ['ALL', ...Object.values(EVENT_CATEGORIES)].map(cat => {
        const isSelected = filter === cat;
        return React.createElement('button', {
          key: cat,
          className: `preset-chip ${isSelected ? 'active' : ''}`,
          style: isSelected ? { background: 'rgba(6, 182, 212, 0.25)', borderColor: 'var(--cyan-neon)', color: '#fff' } : {},
          onClick: () => setFilter(cat)
        },
          cat
        );
      })
    ),

    // Events List
    React.createElement('div', { className: 'event-log-container' },
      filteredEvents.length === 0
        ? React.createElement('div', { style: { textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0', fontSize: '0.8rem' } },
            'No events recorded in this category.'
          )
        : filteredEvents.map(evt => {
            return React.createElement('div', { key: evt.id, className: `event-row ${evt.category}` },
              React.createElement('span', { style: { color: 'var(--text-muted)', flexShrink: 0 } }, evt.timeFormatted),
              React.createElement('span', { className: `badge badge-${getCategoryBadge(evt.category)}`, style: { flexShrink: 0, padding: '0.1rem 0.4rem', fontSize: '0.65rem' } },
                evt.category
              ),
              React.createElement('span', { style: { color: 'var(--text-primary)', flex: 1, wordBreak: 'break-word' } },
                evt.message
              )
            );
          })
    )
  );
}

function getCategoryBadge(cat) {
  switch (cat) {
    case 'TRANSMIT': return 'cyan';
    case 'RECEIVE': return 'success';
    case 'WARNING': return 'warning';
    case 'ERROR': return 'error';
    case 'RECOVERY': return 'cyan';
    default: return 'offline';
  }
}
