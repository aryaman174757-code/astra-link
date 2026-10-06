/**
 * ASTRA-LINK — Main Application Component
 * Coordinates UI Panels, State Machine, and 3D Viewport.
 */

import { SimulationEngine } from './simulation/simulationEngine.js';
import { EventLogger } from './simulation/eventLogger.js';
import { SpaceScene3D } from './components/SpaceScene3D.js';
import { TopBar } from './components/TopBar.js';
import { ContextStrip } from './components/ContextStrip.js';
import { SystemPanel } from './components/SystemPanel.js';
import { MessageComposer } from './components/MessageComposer.js';
import { ArchitectureExplorer } from './components/ArchitectureExplorer.js';
import { TimingComparison } from './components/TimingComparison.js';
import { TelemetryPanel } from './components/TelemetryPanel.js';
import { EventLogPanel } from './components/EventLogPanel.js';
import { DiagnosticsPanel } from './components/DiagnosticsPanel.js';
import { GuidedDemoModal } from './components/GuidedDemoModal.js';
import { AboutModal } from './components/AboutModal.js';
import { runBrowserTestSuite } from '../tests/test_suite.js';
import { SCIENTIFIC_DISCLAIMER } from './simulation/simulationConstants.js';

export function App() {
  const [engine] = React.useState(() => new SimulationEngine({ logger: new EventLogger() }));
  const [snapshot, setSnapshot] = React.useState(() => engine.getSnapshot());
  const [events, setEvents] = React.useState(() => engine.logger.getEvents());

  // 3D Scene ref & instance
  const sceneContainerRef = React.useRef(null);
  const spaceSceneRef = React.useRef(null);

  // Tabs & Modals
  const [activeTab, setActiveTab] = React.useState('architecture');
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);
  const [demoStepIndex, setDemoStepIndex] = React.useState(0);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);
  const [cameraPreset, setCameraPreset] = React.useState('overview');
  const [isRotationPaused, setIsRotationPaused] = React.useState(false);

  // In-browser test results state
  const [testResults, setTestResults] = React.useState(null);

  // Subscribe to Engine & Logger updates
  React.useEffect(() => {
    const unsubEngine = engine.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
      if (spaceSceneRef.current) {
        spaceSceneRef.current.updateSimulationState(newSnapshot);
      }
    });

    const unsubLogger = engine.logger.subscribe((newEvents) => {
      setEvents([...newEvents]);
    });

    return () => {
      unsubEngine();
      unsubLogger();
    };
  }, [engine]);

  // Mount Three.js Space Scene
  React.useEffect(() => {
    if (sceneContainerRef.current && !spaceSceneRef.current) {
      spaceSceneRef.current = new SpaceScene3D(sceneContainerRef.current);
    }
    return () => {
      if (spaceSceneRef.current) {
        spaceSceneRef.current.dispose();
        spaceSceneRef.current = null;
      }
    };
  }, []);

  // --- Handlers ---
  const handleSwitchDirection = () => engine.switchDirection();
  const handleSetSpeed = (s) => engine.setSpeed(s);
  const handleTogglePause = () => engine.togglePause();
  const handleReset = () => {
    engine.resetSimulation();
    if (spaceSceneRef.current) {
      spaceSceneRef.current.setCameraPreset('overview');
      setCameraPreset('overview');
    }
  };

  const handleInitialize = () => engine.initializeSystem();
  const handleEstablishShortcut = () => engine.establishShortcut();
  const handleSynchronize = () => engine.synchronizeSPL();
  const handleSendMessage = (msg) => engine.sendMessage(msg);
  const handleUnlockSPL = () => engine.unlockSPL();
  const handleSimulateFailure = (reason) => engine.simulateFailure(reason);
  const handleRecover = () => engine.recoverConnection();

  // Camera presets
  const handleCameraPreset = (preset) => {
    setCameraPreset(preset);
    if (spaceSceneRef.current) {
      spaceSceneRef.current.setCameraPreset(preset);
    }
  };

  const handleToggleRotation = () => {
    if (spaceSceneRef.current) {
      const paused = spaceSceneRef.current.toggleRotationPause();
      setIsRotationPaused(paused);
    }
  };

  // Run in-browser test suite
  const handleRunTests = async () => {
    setActiveTab('tests');
    const results = await runBrowserTestSuite(engine, (res) => setTestResults(res));
    setTestResults(results);
  };

  // Guided demo execution
  const handleExecuteDemoAction = async (action) => {
    switch (action) {
      case 'focus_overview':
        handleCameraPreset('overview');
        break;
      case 'initialize':
        await engine.initializeSystem();
        break;
      case 'establish_shortcut':
        await engine.establishShortcut();
        break;
      case 'synchronize_spl':
        await engine.synchronizeSPL();
        break;
      case 'load_sample_message':
        // preset loaded in composer
        break;
      case 'send_message':
        await engine.sendMessage('Hello Mars. This is an ASTRA-LINK simulation test from Earth.');
        break;
      case 'inspect_delivery':
        // wait
        break;
      case 'simulate_fault':
        engine.simulateFailure('Simulated metric perturbation collapse');
        break;
      case 'recover':
        await engine.recoverConnection();
        break;
      case 'finish':
        setIsDemoOpen(false);
        break;
    }
  };

  const focusComposer = () => {
    const el = document.getElementById('composer-input');
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return React.createElement('div', { id: 'app-root' },
    // 1. Top Navigation Bar
    React.createElement(TopBar, {
      stateSnapshot: snapshot,
      onSwitchDirection: handleSwitchDirection,
      onSetSpeed: handleSetSpeed,
      onTogglePause: handleTogglePause,
      onReset: handleReset,
      onStartDemo: () => {
        setIsDemoOpen(true);
        setDemoStepIndex(0);
      },
      isDemoActive: isDemoOpen,
      onOpenAbout: () => setIsAboutOpen(true)
    }),

    // 2. Contextual Status Strip
    React.createElement(ContextStrip, { stateSnapshot: snapshot }),

    // 3. Central Interactive 3D Earth–Mars Viewport
    React.createElement('div', { className: 'scene-container-wrapper' },
      React.createElement('div', {
        ref: sceneContainerRef,
        className: 'space-scene-viewport',
        id: 'scene-viewport'
      },
        // Floating HUD: Camera Presets (Top Left)
        React.createElement('div', { className: 'scene-hud-top-left' },
          React.createElement('div', { className: 'camera-controls-bar' },
            React.createElement('span', { style: { fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.2rem' } }, 'Camera:'),
            React.createElement('button', {
              className: `camera-preset-btn ${cameraPreset === 'overview' ? 'active' : ''}`,
              onClick: () => handleCameraPreset('overview')
            }, 'Overview'),
            React.createElement('button', {
              className: `camera-preset-btn ${cameraPreset === 'earth' ? 'active' : ''}`,
              onClick: () => handleCameraPreset('earth')
            }, 'Earth Gateway'),
            React.createElement('button', {
              className: `camera-preset-btn ${cameraPreset === 'mars' ? 'active' : ''}`,
              onClick: () => handleCameraPreset('mars')
            }, 'Mars Gateway'),
            React.createElement('button', {
              className: 'camera-preset-btn',
              onClick: () => handleCameraPreset('reset')
            }, 'Reset View')
          )
        ),

        // Floating HUD: Rotation Toggle (Top Right)
        React.createElement('div', { className: 'scene-hud-top-right' },
          React.createElement('button', {
            className: `btn btn-secondary ${isRotationPaused ? 'btn-mars' : ''}`,
            style: { padding: '0.3rem 0.6rem', fontSize: '0.74rem' },
            onClick: handleToggleRotation
          },
            isRotationPaused ? '▶ Resume Rotation' : '⏸ Pause Rotation'
          )
        ),

        // Floating HUD: Navigation instructions (Bottom Center)
        React.createElement('div', { className: 'scene-hud-bottom' },
          'Left-click + drag to orbit • Scroll to zoom • Right-click to pan'
        ),

        // Pinned 3D Object Screen-Space Labels
        React.createElement('div', { id: 'hud-earth-label', className: 'planet-hud-label earth' },
          React.createElement('div', {
            className: 'planet-hud-tag',
            onClick: () => handleCameraPreset('earth')
          },
            React.createElement('span', { className: 'status-dot active' }),
            'Earth Gateway [Sector 01]'
          )
        ),
        React.createElement('div', { id: 'hud-mars-label', className: 'planet-hud-label mars' },
          React.createElement('div', {
            className: 'planet-hud-tag',
            onClick: () => handleCameraPreset('mars')
          },
            React.createElement('span', { className: 'status-dot', style: { background: 'var(--mars-amber)', boxShadow: '0 0 8px var(--mars-amber)' } }),
            'Mars Gateway [Ares Prime]'
          )
        ),

        // Failure Screen FX Overlay
        snapshot.state === 'FAILED' && React.createElement('div', { className: 'scene-warning-overlay' })
      )
    ),

    // 4. Main Two-Column Dashboard (Step-by-step Workflow & Message Composer)
    React.createElement('div', { className: 'dashboard-grid' },
      // Left Column: Step-by-Step System Panel
      React.createElement(SystemPanel, {
        stateSnapshot: snapshot,
        onInitialize: handleInitialize,
        onEstablishShortcut: handleEstablishShortcut,
        onSynchronize: handleSynchronize,
        onFocusComposer: focusComposer
      }),

      // Right Column: Message Composer & Packet Verification
      React.createElement(MessageComposer, {
        stateSnapshot: snapshot,
        onSendMessage: handleSendMessage,
        onSwitchDirection: handleSwitchDirection
      })
    ),

    // 5. Advanced Information Area (Accessible Tabs)
    React.createElement('div', { style: { padding: '0 1.25rem 1.5rem', maxWidth: '1600px', margin: '0 auto', width: '100%' } },
      React.createElement('div', { className: 'advanced-tabs-nav' },
        React.createElement('button', {
          className: `tab-btn ${activeTab === 'architecture' ? 'active' : ''}`,
          onClick: () => setActiveTab('architecture')
        }, '🧩 How ASTRA-LINK Works'),
        React.createElement('button', {
          className: `tab-btn ${activeTab === 'timing' ? 'active' : ''}`,
          onClick: () => setActiveTab('timing')
        }, '⏱ Conventional Light-Time Comparison'),
        React.createElement('button', {
          className: `tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`,
          onClick: () => setActiveTab('telemetry')
        }, '📊 Gateway Telemetry'),
        React.createElement('button', {
          className: `tab-btn ${activeTab === 'logs' ? 'active' : ''}`,
          onClick: () => setActiveTab('logs')
        }, `📜 Event Log (${events.length})`),
        React.createElement('button', {
          className: `tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`,
          onClick: () => setActiveTab('diagnostics')
        }, '🛠 Diagnostics & Faults'),
        React.createElement('button', {
          className: `tab-btn ${activeTab === 'tests' ? 'active' : ''}`,
          onClick: () => setActiveTab('tests')
        }, '🧪 Automated Tests')
      ),

      // Tab Content Render
      activeTab === 'architecture' && React.createElement(ArchitectureExplorer, {
        activeModuleId: snapshot.activeModuleId
      }),

      activeTab === 'timing' && React.createElement(TimingComparison, {
        shortcutDuration: snapshot.shortcutDuration
      }),

      activeTab === 'telemetry' && React.createElement(TelemetryPanel, {
        stateSnapshot: snapshot
      }),

      activeTab === 'logs' && React.createElement(EventLogPanel, {
        events: events,
        onClearLog: () => engine.logger.clear()
      }),

      activeTab === 'diagnostics' && React.createElement(DiagnosticsPanel, {
        stateSnapshot: snapshot,
        onUnlockSPL: handleUnlockSPL,
        onSimulateFailure: handleSimulateFailure,
        onRecover: handleRecover,
        onRunBrowserTests: handleRunTests
      }),

      activeTab === 'tests' && React.createElement('div', { className: 'glass-panel', style: { padding: '1.25rem' } },
        React.createElement('div', { className: 'panel-section-title' },
          React.createElement('div', { className: 'panel-title' },
            React.createElement('span', { style: { color: 'var(--cyan-400)' } }, '🧪'),
            'Automated 20-Criteria Verification Suite'
          ),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: handleRunTests
          }, 'Re-run Test Suite ⚡')
        ),
        React.createElement('div', { style: { fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' } },
          'Automated verification of conventional light-time math, zero/negative distance handling, transmission state machines, text fidelity, and failure resilience.'
        ),
        testResults && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.4rem' } },
          testResults.map(r => React.createElement('div', {
            key: r.id,
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${r.passed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
            }
          },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' } },
              React.createElement('span', null, r.passed ? '✅' : '❌'),
              React.createElement('strong', { style: { color: r.passed ? '#f8fafc' : '#f87171' } }, `${r.id}. ${r.name}`)
            ),
            React.createElement('div', { style: { fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } },
              r.details
            )
          ))
        ),
        !testResults && React.createElement('div', { style: { textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' } },
          'Click "Re-run Test Suite" to execute all 20 tests.'
        )
      )
    ),

    // 6. Persistent Unobtrusive Disclaimer Banner
    React.createElement('footer', { className: 'disclaimer-banner' },
      SCIENTIFIC_DISCLAIMER
    ),

    // 7. Modals
    React.createElement(GuidedDemoModal, {
      isOpen: isDemoOpen,
      currentStepIndex: demoStepIndex,
      onNextStep: () => setDemoStepIndex(prev => Math.min(prev + 1, 9)),
      onPrevStep: () => setDemoStepIndex(prev => Math.max(prev - 1, 0)),
      onSkipStep: () => setDemoStepIndex(prev => Math.min(prev + 1, 9)),
      onClose: () => setIsDemoOpen(false),
      onExecuteDemoAction: handleExecuteDemoAction,
      isBusy: snapshot.isBusy
    }),

    React.createElement(AboutModal, {
      isOpen: isAboutOpen,
      onClose: () => setIsAboutOpen(false)
    })
  );
}
