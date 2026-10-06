/**
 * ASTRA-LINK — Guided Demonstration Mode
 * 10-Step Interactive Faculty Tour with Real Simulation Actions
 */

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Welcome to ASTRA-LINK',
    description: 'Explore the 3D space scene showing Earth on the left and Mars on the right. You can orbit with left-drag, zoom with the scroll wheel, and click camera presets.',
    actionLabel: 'Next: Initialize Endpoints',
    autoAction: 'focus_overview'
  },
  {
    step: 2,
    title: 'Step 1: System Initialization',
    description: 'We now power on the Earth Ground Gateway and Mars Orbital Transceiver arrays to establish base telemetry diagnostics.',
    actionLabel: 'Execute Initialization',
    autoAction: 'initialize'
  },
  {
    step: 3,
    title: 'Step 2: Establish Spacetime Shortcut',
    description: 'With endpoints online, we initiate the conceptual metric perturbation to form the hypothetical ASTRA Throat connecting the two planets.',
    actionLabel: 'Establish Shortcut',
    autoAction: 'establish_shortcut'
  },
  {
    step: 4,
    title: 'Step 3: Synchronize Spacetime Phase Lock (SPL)',
    description: 'The shortcut is formed, but quantum clocks and phase reference carriers must be locked at 99.8% coherence before data packets can traverse.',
    actionLabel: 'Synchronize SPL',
    autoAction: 'synchronize_spl'
  },
  {
    step: 5,
    title: 'Step 4: Compose Sample Message',
    description: 'We load the faculty demonstration message: "Hello Mars. This is an ASTRA-LINK simulation test from Earth." into the quantum modulation buffer.',
    actionLabel: 'Load Sample Message',
    autoAction: 'load_sample_message'
  },
  {
    step: 6,
    title: 'Step 5: Transmit Packet Through ASTRA Throat',
    description: 'The packet is encoded into a Spacetime Information State and traverses the curved throat. Observe the luminous photon wavepacket traveling across 3D space.',
    actionLabel: 'Transmit Signal',
    autoAction: 'send_message'
  },
  {
    step: 7,
    title: 'Step 6: State Reconstruction & 100% Exact Verification',
    description: 'The receiving State Reconstruction Engine decodes the packet. Notice the 100% exact byte fidelity verification confirming zero data corruption.',
    actionLabel: 'Inspect Verification',
    autoAction: 'inspect_delivery'
  },
  {
    step: 8,
    title: 'Step 7: Fault Injection & Controlled Throat Collapse',
    description: 'Now we test system resilience. We inject a simulated metric collapse. Notice how in-transit signals are safely aborted without false delivery.',
    actionLabel: 'Inject Channel Fault',
    autoAction: 'simulate_fault'
  },
  {
    step: 9,
    title: 'Step 8: Automated Link Recovery',
    description: 'We trigger automated link recovery. The system re-stabilizes throat geometry, re-aligns phase references, and re-locks SPL back to 99.8%.',
    actionLabel: 'Trigger Recovery',
    autoAction: 'recover'
  },
  {
    step: 10,
    title: 'Demonstration Complete',
    description: 'ASTRA-LINK successfully demonstrated full lifecycle communication, state-driven 3D visuals, fault handling, and conventional light-time comparisons.',
    actionLabel: 'Finish Tour',
    autoAction: 'finish'
  }
];

export function GuidedDemoModal({
  isOpen,
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onSkipStep,
  onClose,
  onExecuteDemoAction,
  isBusy
}) {
  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === DEMO_STEPS.length - 1;

  const handleAction = () => {
    onExecuteDemoAction(currentStep.autoAction);
    if (!isLast) {
      onNextStep();
    } else {
      onClose();
    }
  };

  return React.createElement('div', { className: 'modal-overlay', style: { zIndex: 120 } },
    React.createElement('div', { className: 'modal-content', style: { maxWidth: '580px', border: '1px solid var(--cyan-neon)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)' } },
      // Header
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' } },
          React.createElement('span', { className: 'badge badge-cyan' }, `TOUR STEP ${currentStep.step} / ${DEMO_STEPS.length}`),
          React.createElement('h3', { style: { fontSize: '1.05rem', color: 'var(--text-primary)' } }, currentStep.title)
        ),
        React.createElement('button', {
          className: 'btn btn-secondary',
          style: { padding: '0.2rem 0.5rem', fontSize: '0.75rem' },
          onClick: onClose
        }, '✕ Exit')
      ),

      // Progress Dots
      React.createElement('div', { style: { display: 'flex', gap: '0.3rem', marginBottom: '1rem' } },
        DEMO_STEPS.map((s, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return React.createElement('div', {
            key: s.step,
            style: {
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: isCurrent ? 'var(--cyan-neon)' : (isDone ? 'var(--status-success)' : 'rgba(51, 65, 85, 0.6)'),
              boxShadow: isCurrent ? '0 0 8px var(--cyan-neon)' : 'none',
              transition: 'all 0.2s ease'
            }
          });
        })
      ),

      // Body Text
      React.createElement('div', { style: { fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '1.25rem' } },
        currentStep.description
      ),

      // Footer Actions
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' } },
        React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: onPrevStep,
            disabled: isFirst || isBusy
          }, '← Prev'),
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: onSkipStep,
            disabled: isLast || isBusy
          }, 'Skip ⏭')
        ),
        React.createElement('button', {
          className: 'btn btn-primary',
          onClick: handleAction,
          disabled: isBusy
        },
          isBusy ? 'Executing...' : `${currentStep.actionLabel} →`
        )
      )
    )
  );
}
