# ASTRA-LINK — Adaptive Spacetime Transmission & Relayed Architecture
### Interactive 3D Earth–Mars Spacetime Communication Simulator

> **CONCEPTUAL SIMULATION DISCLAIMER**  
> ASTRA-LINK visualizes a hypothetical spacetime communication architecture for exchanging information between Earth and Mars through a proposed spacetime shortcut. The proposed shortcut and synchronization mechanism have not been experimentally demonstrated. Shortcut transmission times shown here are illustrative software parameters, not measured or predicted physical results.

---

## 1. Project Overview & Identity
**ASTRA-LINK** (*Adaptive Spacetime Transmission & Relayed Architecture*) is an aerospace scientific visualization prototype and engineering demonstration. It explores the conceptual systems engineering, information modulation, state synchronization, packet verification, and fail-safe recovery required if humanity were ever to relay signals through a localized topological shortcut (conduit / throat) across interplanetary distances.

The prototype bridges high-fidelity interactive 3D WebGL graphics with a rigorous client-side state machine, realistic communication pipelines, and mathematical comparisons with conventional electromagnetic propagation at light speed.

---

## 2. Core Features & Capabilities

- **Interactive 3D Earth–Mars Environment**:
  - Procedural Earth featuring atmospheric Rayleigh rim glow, continental geography, specular ocean reflectance, and a rotating cloud canopy.
  - Procedural Mars displaying characteristic iron oxide rust terrain, surface craters, polar ice caps, and dust horizon lighting.
  - Hypothesized **ASTRA Throat**: A curved 3D Catmull-Rom conduit connecting planetary orbital sectors, featuring dynamic gravitational lensing rings and flowing subspace particle streams.
  - Dual-Axis Quantum Gyro Rings at both Earth and Mars gateways that visually track system readiness, phase locking, and transmission bursts.
  - Interactive camera orbit, bounded zoom, panning, and instant presets (*System Overview*, *Focus Earth Gateway*, *Focus Mars Gateway*, *Reset View*).
  - Pinned screen-space HUD tags tracking 3D planetary positions in real time.

- **Centralized Simulation State Machine (13 States)**:
  - Deterministic state transitions: `OFFLINE` → `INITIALIZING` → `READY` → `ESTABLISHING_SHORTCUT` → `SHORTCUT_ESTABLISHED` → `SPL_LOCKING` → `SYNCHRONIZED` → `TRANSMITTING` → `RECONSTRUCTING` → `DELIVERED` (with `DEGRADED`, `FAILED`, and `RECOVERING` error pathways).
  - Rapid click guards (`isBusy`), asynchronous token cancellation upon reset, and safe pause/resume.

- **Four-Step Guided User Workflow**:
  - **Step 1 — Initialize Endpoints**: Powers up ground and orbital transceivers.
  - **Step 2 — Establish Shortcut**: Deploys the conceptual spacetime metric to form the throat.
  - **Step 3 — Synchronize Link (SPL)**: Locks quantum phase coherence to 99.8%.
  - **Step 4 — Send Message**: Enables high-integrity packet transmission with live progress and byte verification.

- **15-Stage Message Transmission Pipeline & Verification**:
  - Information-State Modulation → Spacetime Information State Encoding → Throat Ingress → Wormhole Transit → Gateway Egress → State Reconstruction Engine.
  - **100% Byte Fidelity Verification**: Strict post-reconstruction comparison confirming zero bit rot or character alteration across Unicode, emojis, numbers, and symbols.

- **Conventional Light-Time Comparison Tool**:
  - Calculates physical electromagnetic propagation latency:
    $$\text{Light Time} = \frac{\text{Distance (km)}}{299,792.458\text{ km/s}}$$
  - Preset orbital configurations:
    - *Closest Approach (Opposition)*: 54.6M km (~3.04 min one-way)
    - *Mean Orbital Distance*: 225.0M km (~12.51 min one-way)
    - *Reference Orbit Configuration*: 328.0M km (~18.23 min one-way)
    - *Solar Conjunction (Maximum)*: 401.0M km (~22.29 min one-way)
  - Interactive continuous slider (50M km to 410M km) with real-time one-way and round-trip calculations.
  - Clear academic distinction between vacuum physical light speed ($c$) and simulated software parameters.

- **Fault Injection & Automated Self-Healing**:
  - *Simulate SPL Unlock*: Induces phase drift and elevated jitter, safely blocking transmission.
  - *Collapse Throat Mid-Transit*: Aborts active in-flight packets, marks transmission as interrupted, and increments failure telemetry without false delivery success.
  - *Automated Link Recovery*: Re-stabilizes metric geometry and re-locks SPL back to 99.8% coherence.

- **Guided Demonstration Tour (10 Steps)**:
  - Automated faculty tour walking through onboarding, initialization, shortcut deployment, phase locking, sample message transmission, state reconstruction verification, fault injection, and automated recovery.

---

## 3. Technology Stack & Zero-Cost Architecture

- **Frontend Core**: Vanilla HTML5, Modern ECMAScript (ES2022+ Modules), React 18 (Client-side component hierarchy).
- **Styling**: Vanilla CSS3 design system with custom HSL/RGB design tokens, glassmorphism, responsive CSS Grid / Flexbox layout, and accessibility focus outlines.
- **3D Graphics Engine**: Three.js (r128) + OrbitControls. Pure procedural textures generated on in-memory HTML5 canvases (zero external texture image dependencies).
- **Backend / Server**: Python 3 standard library (`http.server` with `ThreadingMixIn` and MIME mapping).
- **Dependencies & Costs**:
  - **$0 Cost**: No paid APIs, cloud services, external databases, or authentication required.
  - **100% Offline Capable**: Bundled local vendor libraries in `vendor/` guarantee seamless offline execution.

---

## 4. Quick Start & Execution

### Prerequisites
- Python 3.8+ (Available by default on Windows/macOS/Linux)
- Any modern web browser (Chrome, Edge, Firefox, Brave, Safari, Opera)

### Running the Application Locally
1. Open PowerShell or a terminal in the project directory:
   ```powershell
   cd "C:\Users\Computer Network\.gemini\antigravity-ide\scratch\astra-link"
   ```
2. Start the local multi-threaded development server:
   ```powershell
   python server.py
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 5. Conceptual Architecture Modules

| Module # | Name | Operational Role |
| :--- | :--- | :--- |
| **01** | **Earth ASTRA Engine** | Coordinates ground uplinks, packet queuing, and quantum buffer management. |
| **02** | **Information-State Modulator** | Converts binary bitstreams into high-dimensional spacetime informational state vectors. |
| **03** | **Spacetime Information State** | Mathematical & quantum packet representation structured to resist non-Euclidean decoherence. |
| **04** | **Shortcut Communication Engine** | Regulates field harmonics that sustain the throat geometry. |
| **05** | **Hypothetical ASTRA Throat** | The theoretical topological shortcut connecting Earth and Mars orbital sectors. |
| **06** | **Spacetime Phase Lock (SPL)** | Synchronizes reference clocks and phase alignment between dual gateways. |
| **07** | **Mars ASTRA Engine** | Terminus station in Ares orbit routing arriving packets to planetary transceivers. |
| **08** | **State Reconstruction Engine** | Performs inverse unitary transformation to decode and verify exact Unicode message fidelity. |

---

## 6. Automated Testing & Verification

ASTRA-LINK includes an automated test suite verifying all 20 criteria mandated by the specification:

```powershell
python -m unittest tests/test_simulation.py -v
```

### Verified Test Suite (20/20 Passed):
1. `test_01_conventional_light_time`: Calculates accurate light delay using $c = 299,792.458\text{ km/s}$.
2. `test_02_invalid_distance_handling`: Returns safe `None` for negative, NaN, or non-numeric inputs.
3. `test_03_zero_distance_handling`: Correctly computes 0.00s for zero distance.
4. `test_04_earth_to_mars_transmission`: Verifies forward transmission pipeline and counters.
5. `test_05_mars_to_earth_transmission`: Verifies reverse transmission pipeline and counters.
6. `test_06_exact_text_reconstruction`: Confirms 100% byte fidelity across Unicode, symbols, and emojis.
7. `test_07_rejection_when_offline`: Prevents premature transmissions when system is offline.
8. `test_08_rejection_when_spl_unlocked`: Blocks message dispatch when SPL coherence is degraded.
9. `test_09_message_interruption_on_failure`: Halts in-transit signals upon throat collapse without false success.
10. `test_10_recovery_from_failure`: Verifies automated link recovery restores synchronized status.
11. `test_11_reset_during_initialization`: Cancels ongoing timers and resets cleanly to OFFLINE.
12. `test_12_reset_during_transmission`: Flushes buffers and purges in-transit packets upon reset.
13. `test_13_pause_and_resume`: Toggles pause state without state loss or memory corruption.
14. `test_14_duplicate_click_prevention`: Rejects concurrent rapid clicks via atomic busy locks.
15. `test_15_counters_accuracy`: Accurately increments delivered and failed packet metrics.
16. `test_16_event_logging`: Correctly formats, categorizes, and timestamps telemetry entries.
17. `test_17_no_false_delivery_success`: Guarantees delivery confirmation only triggers on real verification.
18. `test_18_progress_reporting`: Synchronizes state machine progress with visible telemetry strings.
19. `test_19_guided_demo_sequence`: Validates end-to-end execution of guided faculty demo steps.
20. `test_20_camera_presets`: Confirms camera presets (*Overview*, *Earth*, *Mars*, *Reset*).

*In addition to CLI tests, users can execute the in-browser test suite from the "🧪 Automated Tests" tab.*

---

## 7. Faculty Demonstration Script (3–5 Minutes)

1. **Introduction (30s)**:
   - Launch `http://localhost:8080`.
   - Point out the central 3D space scene showing Earth on the left, Mars on the right, and the dormant communication channel.
   - Highlight the top status badge showing **OFFLINE** and note the persistent conceptual disclaimer.
2. **System Setup & Phase Lock (1m)**:
   - Click **Initialize System** (Step 1). Observe the gateway quantum rings powering up.
   - Click **Establish Shortcut** (Step 2). Observe the curved cyan ASTRA Throat forming across space.
   - Click **Synchronize SPL** (Step 3). Explain the Spacetime Phase Lock concept: quantum clocks align to 99.8% coherence, transitioning the system to **SYNCHRONIZED**.
3. **Message Transmission & Exact Reconstruction (1m)**:
   - Click the preset button: *"Hello Mars. This is an ASTRA-LINK simulation test from Earth."*
   - Click **Send Message 🚀** (Step 4).
   - Track the luminous photon wavepacket traversing the 3D throat from Earth to Mars.
   - Inspect the **Delivery Confirmation Card**: highlight the **100% Byte Fidelity Verification**, packet ID, sequence number, and transit time.
   - Click **⇋ Reverse Direction** and send a telemetry reply from Mars to Earth.
4. **Fault Injection & Self-Healing Resilience (1m)**:
   - Scroll down to the **Diagnostics & Faults** tab.
   - Click **Simulate SPL Unlock 🔓** to demonstrate phase drift (system locks out new dispatches).
   - Click **Restore Connection 🔄** to demonstrate the automated recovery routine.
   - Optionally trigger **Collapse Throat Mid-Transit** during a transmission to show that signals are safely aborted without false delivery.
5. **Scientific Comparison & Conclusion (30s)**:
   - Open the **Conventional Light-Time Comparison** tab.
   - Adjust the orbital distance slider to demonstrate that real radio signals take 3.0 to 22.3 minutes one-way ($t = d/c$).
   - Conclude by emphasizing the distinction between physical electromagnetism and this conceptual systems demonstration.

---

## 8. Limitations & Future Research
- **Conceptual Physics**: Faster-than-light informational traversal or macroscopic wormholes remain purely theoretical and are not validated by experimental physics.
- **Orbital Dynamics**: The 3D viewport represents a conceptual static orbital composition for clear human visualization rather than dynamic Keplerian n-body orbital integration.
- **Relativistic Time Dilation**: Gravitational and kinematic time dilation within the throat manifold are represented through illustrative phase coherence parameters.
