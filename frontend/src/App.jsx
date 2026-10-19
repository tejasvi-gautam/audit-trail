
import { useState } from "react";
import {
  Activity, AlertTriangle, Anchor, ArrowUpRight, Bell, Box,
  CalendarClock, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, Clock3, Download, Fingerprint, GitBranch,
  Layers3, LockKeyhole, MapPin, MapPinned, Package, Search,
  Navigation, Route, SearchCheck,
  ShieldCheck, Ship, Sparkles, Target, Thermometer, Waves, X
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import "./App.css";

const shipments = {
  "CONT-2026-0842": {
    id: "CONT-2026-0842",
    route: "Shanghai, CN → Rotterdam, NL",
    containerType: "40 ft refrigerated",
    ship: "MV Northern Star",
    status: "In transit",
    destination: "Port of Rotterdam",
    lastUpdate: "Today, 10:42 UTC",
    trackingStatus: "In Transit",
    originPort: "Port of Shanghai",
    originCode: "CNSHA",
    currentLocation: "North Atlantic Ocean",
    destinationCode: "NLRTM",
    eta: "Oct 22, 2026 · 14:00 UTC",
    progress: 68,
    vesselPosition: { x: 59, y: 43 },
    routePath: "M 14 69 C 28 67, 37 57, 48 49 S 72 28, 88 25",
    events: [
      {
        type: "CONTAINER_CREATED",
        title: "Container created",
        date: "Oct 12, 2026 · 08:12:04 UTC",
        location: "Shanghai Logistics Hub, CN",
        detail: "Container registered and shipment manifest sealed.",
        hash: "8f2a91c4...d10e",
        version: 1,
        tone: "blue"
      },
      {
        type: "LOADED_ON_SHIP",
        title: "Loaded onto vessel",
        date: "Oct 12, 2026 · 14:35:19 UTC",
        location: "Port of Shanghai, CN",
        detail: "Manifest verified. Vessel assignment confirmed.",
        hash: "b30e1f7a...4c21",
        version: 2,
        tone: "blue"
      },
      {
        type: "TEMPERATURE_SPIKE",
        title: "Temperature spike detected",
        date: "Oct 14, 2026 · 03:18:52 UTC",
        location: "East China Sea",
        detail: "Sensor reached 9.4°C, exceeding the 8°C safety threshold.",
        hash: "c74a06bd...81ff",
        version: 3,
        tone: "red"
      },
      {
        type: "TEMP_NORMALIZED",
        title: "Temperature normalized",
        date: "Oct 14, 2026 · 03:31:07 UTC",
        location: "East China Sea",
        detail: "Cooling unit restored the temperature to the safe range.",
        hash: "ef2d19a0...7b16",
        version: 4,
        tone: "green"
      },
      {
        type: "VESSEL_POSITION_UPDATED",
        title: "Vessel position updated",
        date: "Oct 15, 2026 · 18:05:33 UTC",
        location: "North Atlantic Ocean",
        detail: "GPS position received and validated by the tracking system.",
        hash: "5a8b31ce...f902",
        version: 5,
        tone: "blue"
      },
      {
        type: "ARRIVED_AT_PORT",
        title: "Arrived at port",
        date: "Oct 16, 2026 · 10:42:11 UTC",
        location: "Port of Rotterdam, NL",
        detail: "Arrival recorded. Customs inspection pending.",
        hash: "a0d1cfe8...33b7",
        version: 6,
        tone: "green"
      }
    ]
  },

  "CONT-2026-0197": {
    id: "CONT-2026-0197",
    route: "Mumbai, IN → Hamburg, DE",
    containerType: "20 ft dry cargo",
    ship: "MV Ocean Crest",
    status: "Customs review",
    destination: "Port of Hamburg",
    lastUpdate: "Today, 09:16 UTC",
    trackingStatus: "Delayed",
    originPort: "Jawaharlal Nehru Port",
    originCode: "INNSA",
    currentLocation: "Port of Hamburg",
    destinationCode: "DEHAM",
    eta: "Oct 24, 2026 · 08:30 UTC",
    progress: 82,
    vesselPosition: { x: 84, y: 27 },
    routePath: "M 17 74 C 28 67, 40 53, 54 48 S 75 34, 88 24",
    events: [
      {
        type: "CONTAINER_CREATED",
        title: "Container created",
        date: "Oct 10, 2026 · 06:20:12 UTC",
        location: "Mumbai Cargo Terminal, IN",
        detail: "Container and shipment record initialized.",
        hash: "0b19f2a1...d884",
        version: 1,
        tone: "blue"
      },
      {
        type: "LOADED_ON_SHIP",
        title: "Loaded onto vessel",
        date: "Oct 10, 2026 · 12:45:01 UTC",
        location: "Jawaharlal Nehru Port, IN",
        detail: "Loading manifest signed by the port operator.",
        hash: "6e8d70aa...2b91",
        version: 2,
        tone: "blue"
      },
      {
        type: "ARRIVED_AT_PORT",
        title: "Arrived at port",
        date: "Oct 16, 2026 · 09:16:44 UTC",
        location: "Port of Hamburg, DE",
        detail: "Container held for customs review.",
        hash: "d210b1fe...a6c2",
        version: 3,
        tone: "green"
      }
    ]
  }
};

const temperatureData = [
  { time: "00:00", temp: 4.2 },
  { time: "02:00", temp: 4.4 },
  { time: "04:00", temp: 4.1 },
  { time: "06:00", temp: 4.5 },
  { time: "08:00", temp: 4.3 },
  { time: "10:00", temp: 4.6 },
  { time: "12:00", temp: 5.1 },
  { time: "14:00", temp: 5.4 },
  { time: "16:00", temp: 6.2 },
  { time: "18:00", temp: 9.4 },
  { time: "20:00", temp: 6.7 },
  { time: "22:00", temp: 4.8 },
  { time: "23:59", temp: 4.3 }
];

function getEventIcon(type) {
  if (type.includes("TEMPERATURE") || type.includes("TEMP")) {
    return Thermometer;
  }
  if (type.includes("LOADED")) return Ship;
  if (type.includes("ARRIVED")) return Anchor;
  if (type.includes("POSITION")) return MapPin;
  return Package;
}

function App() {
  const [query, setQuery] = useState("CONT-2026-0842");
  const [activeId, setActiveId] = useState("CONT-2026-0842");
  const [selectedEvent, setSelectedEvent] = useState(2);
  const [activeTab, setActiveTab] = useState("Timeline");
  const [activeSection, setActiveSection] = useState("overview");
  const [mapZoom, setMapZoom] = useState(1);
  const [integrityCheck, setIntegrityCheck] = useState({
    status: "pending",
    checkedAt: ""
  });
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [notice, setNotice] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const [setupStep, setSetupStep] = useState(0);
  const [setupChoices, setSetupChoices] = useState({
    age: "",
    discovery: "",
    preferences: []
  });

  const shipment = shipments[activeId];
  const events = shipment.events;
  const currentIndex = Math.min(selectedEvent, events.length - 1);
  const currentEvent = events[currentIndex];
  const previousEvent = events[currentIndex - 1];
  const hasSpike = events.some(
    event => event.type === "TEMPERATURE_SPIKE"
  );

  const originEventIndex = 0;
  const destinationEventIndex = events.length - 1;
  const positionEventIndex = events.findIndex(event => event.type === "VESSEL_POSITION_UPDATED");

  function inspectShipment(e) {
    e.preventDefault();
    const id = query.trim().toUpperCase();

    if (shipments[id]) {
      setActiveId(id);
      setSelectedEvent(0);
      setIntegrityCheck({ status: "pending", checkedAt: "" });
      setShowAllEvents(true);
      setIsWatching(false);
      setNotice("");
    } else {
      setNotice(
        "Shipment not found. Try CONT-2026-0842 or CONT-2026-0197."
      );
    }
  }

  function chooseShipment(id) {
    setQuery(id);
    setActiveId(id);
    setSelectedEvent(0);
    setIntegrityCheck({ status: "pending", checkedAt: "" });
    setShowAllEvents(true);
    setIsWatching(false);
    setNotice("");
  }

  function exportAudit() {
    const data = {
      shipmentId: shipment.id,
      exportedAt: new Date().toISOString(),
      note: "Sample frontend data. Verify event hashes through the backend.",
      events
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${shipment.id}-audit-trail.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function reviewTemperatureEvent() {
    const index = events.findIndex(
      event => event.type === "TEMPERATURE_SPIKE"
    );

    if (index !== -1) {
      selectEvent(index);
      document.getElementById("timeline")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  const setupQuestions = [
      {
        eyebrow: "WORKSPACE SETUP · 1 OF 3",
        title: "What is your age?",
        description: "This helps us tailor the experience for your team.",
        key: "age",
        options: [
          { label: "13–17", detail: "Teenager", icon: Target },
          { label: "18–24", detail: "Young adult", icon: Sparkles },
          { label: "25–34", detail: "Adult", icon: Activity },
          { label: "35+", detail: "Experienced professional", icon: ShieldCheck }
        ]
      },
      {
        eyebrow: "WORKSPACE SETUP · 2 OF 3",
        title: "What were you looking for when you found us?",
        description: "Choose the option that best describes what brought you here.",
        key: "discovery",
        options: [
          { label: "Shipment tracking", detail: "I wanted to follow a shipment", icon: MapPin },
          { label: "Event history", detail: "I needed an audit trail", icon: Activity },
          { label: "Sensor monitoring", detail: "I wanted condition updates", icon: Thermometer },
          { label: "Just exploring", detail: "I wanted to learn more", icon: Search }
        ]
      },
      {
        eyebrow: "WORKSPACE PREFERENCES · 3 OF 3",
        title: "Which tools should be ready for you?",
        description: "Select any preferences to make your audit workspace more useful.",
        key: "preferences",
        multiSelect: true,
        options: [
          { label: "Shipment alerts", detail: "Get notified about important events", icon: Bell, badge: "Recommended" },
          { label: "Sensor insights", detail: "Keep condition risks in view", icon: Thermometer, badge: "Live" },
          { label: "Audit exports", detail: "Keep reports ready to download", icon: Download, badge: "Reports" },
          { label: "Daily operations digest", detail: "Receive a concise daily summary", icon: CalendarClock, badge: "Optional" }
        ]
      }
  ];

  function openWorkspaceSetup() {
    setSetupStep(0);
    setIsSetupOpen(true);
  }

  function selectSetupChoice(key, value) {
    setSetupChoices(current => {
      if (key !== "preferences") return { ...current, [key]: value };

      const preferences = current.preferences.includes(value)
        ? current.preferences.filter(preference => preference !== value)
        : [...current.preferences, value];
      return { ...current, preferences };
    });
  }

  function setAllPreferences() {
    const preferenceOptions = setupQuestions[2].options.map(option => option.label);
    setSetupChoices(current => ({
      ...current,
      preferences: current.preferences.length === preferenceOptions.length ? [] : preferenceOptions
    }));
  }

  function continueSetup() {
    const question = setupQuestions[setupStep];
    if (!question.multiSelect && !setupChoices[question.key]) {
      setNotice("Please choose an option to continue.");
      return;
    }

    if (setupStep < setupQuestions.length - 1) {
      setSetupStep(step => step + 1);
      setNotice("");
      return;
    }

    setIsSetupOpen(false);
    const preferences = setupChoices.preferences.length
      ? ` Preferences enabled: ${setupChoices.preferences.join(", ")}.`
      : " No optional preferences were selected.";
    setNotice(`Workspace setup complete.${preferences}`);
  }

  function navigateToSection(sectionId) {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function selectEvent(index) {
    setSelectedEvent(index);
    setIntegrityCheck({ status: "pending", checkedAt: "" });
  }

  function runIntegrityCheck() {
    setIntegrityCheck({
      status: "verified",
      checkedAt: new Date().toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
      })
    });
  }

  function selectMapEvent(index) {
    selectEvent(index);
    navigateToSection("timeline");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <GitBranch size={22} />
          </div>
          <div>
            <strong>audit<span>trail</span></strong>
            <small>EVENT LEDGER</small>
          </div>
        </div>

        <div className="workspace-label">
          WORKSPACE <ChevronDown size={13} />
        </div>

        <nav className="side-nav">
          <button
            className={activeSection === "overview" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("overview")}
            title="Overview"
            type="button"
          >
            <Layers3 size={18} /> Overview
          </button>
          <button
            className={activeSection === "timeline" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("timeline")}
            title="Event timeline"
            type="button"
          >
            <Activity size={18} /> Event timeline
            <span className="nav-count">{events.length}</span>
          </button>
          <button
            className={activeSection === "containers" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("containers")}
            title="Containers"
            type="button"
          >
            <Box size={18} /> Containers
          </button>
          <button
            className={activeSection === "tracking" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("tracking")}
            title="Live shipment tracking"
            type="button"
          >
            <MapPinned size={18} /> Live tracking
          </button>
          <button
            className={activeSection === "sensors" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("sensors")}
            title="Sensor analytics"
            type="button"
          >
            <Waves size={18} /> Sensor analytics
          </button>
          <button
            className={activeSection === "integrity" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("integrity")}
            title="Integrity audit"
            type="button"
          >
            <ShieldCheck size={18} /> Integrity audit
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-card">
            <div className="secure-icon">
              <LockKeyhole size={17} />
            </div>
            <strong>Immutable ledger</strong>
            <p>
              Events are designed to be append-only and versioned.
            </p>
            <div className="secure-status">
              <span /> Demo ledger interface
            </div>
          </div>

          <div className="profile">
            <div className="avatar">LM</div>
            <div className="profile-text">
              <strong>Logistics Manager</strong>
              <small>Operations team</small>
            </div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            Supply chain <ChevronRight size={14} />
            <strong>Shipment audit workspace</strong>
          </div>

          <div className="topbar-right">
            <span className="live-dot" />
            <span className="live-label">Dashboard online</span>
            <div className="active-users" aria-label="You are currently active in the dashboard">
              <div className="user-stack" aria-hidden="true">
                <span className="user-avatar user-avatar-one">LM</span>
              </div>
              <span><strong>You</strong> are active</span>
            </div>
            <button className="setup-trigger" onClick={openWorkspaceSetup}>
              <Sparkles size={15} /> Workspace setup
            </button>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
            <div className="avatar small">LM</div>
          </div>
        </header>

        <section className="page-heading" id="overview">
          <div>
            <div className="eyebrow">
              SHIPMENT AUDIT WORKSPACE
            </div>
            <h1>Understand every shipment event</h1>
            <p>
              Search for a container, select an event, and review the shipment
              state, sensor readings, and audit details together.
            </p>
          </div>

          <div className="heading-actions">
            <button
              className={isWatching ? "button button-watch watching" : "button button-watch"}
              onClick={() => setIsWatching(value => !value)}
              aria-pressed={isWatching}
            >
              <Bell size={16} /> {isWatching ? "Watching shipment" : "Watch shipment"}
            </button>
            <button className="button button-secondary" onClick={exportAudit}>
              <Download size={16} /> Export audit log
            </button>
          </div>
        </section>

        {isWatching && (
          <div className="watch-banner" role="status">
            <span className="watch-pulse"><Bell size={14} /></span>
            <div>
              <strong>Live watch enabled for {shipment.id}</strong>
              <span>New events and sensor excursions will appear in this workspace.</span>
            </div>
            <button onClick={() => setIsWatching(false)} aria-label="Stop watching shipment">Stop watching</button>
          </div>
        )}

        <section className="search-panel" id="containers">
          <div className="search-intro">
            <div className="search-symbol">
              <Search size={19} />
            </div>
            <div>
              <strong>Find a shipment</strong>
              <p>
                Enter a container ID to open its complete event history.
              </p>
            </div>
          </div>

          <form className="search-form" onSubmit={inspectShipment}>
            <Search size={17} />
            <input
              aria-label="Shipment ID"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter a container ID"
            />
            <button className="button button-primary" type="submit">
              Inspect shipment <ChevronRight size={16} />
            </button>
          </form>

          <div className="quick-search">
            SAMPLE SHIPMENTS:
            <button onClick={() => chooseShipment("CONT-2026-0842")}>
              CONT-2026-0842
            </button>
            <button onClick={() => chooseShipment("CONT-2026-0197")}>
              CONT-2026-0197
            </button>
          </div>

          {notice && <div className="search-notice">{notice}</div>}
        </section>

        <section className="tracking-panel panel" id="tracking">
          <div className="panel-header tracking-header">
            <div>
              <div className="panel-title"><MapPinned size={17} /> Live shipment tracking</div>
              <p>Follow route progress, port activity, and estimated arrival in real time.</p>
            </div>
            <span className="tracking-live"><span /> LIVE POSITION</span>
          </div>

          <div className="tracking-layout">
            <div className="map-stage" aria-label={`Shipment route from ${shipment.originPort} to ${shipment.destination}`}>
              <div className="map-toolbar">
                <span><Route size={14} /> Route overview</span>
                <div className="map-zoom-controls">
                  <button type="button" onClick={() => setMapZoom(value => Math.min(1.18, value + 0.06))} aria-label="Zoom in">+</button>
                  <button type="button" onClick={() => setMapZoom(value => Math.max(1, value - 0.06))} aria-label="Zoom out">−</button>
                </div>
              </div>
              <div className="map-viewport">
                <div className="map-canvas" style={{ transform: `scale(${mapZoom})` }}>
                  <div className="map-grid-lines" />
                  <div className="map-landmass landmass-one" />
                  <div className="map-landmass landmass-two" />
                  <div className="map-landmass landmass-three" />
                  <svg className="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path className="route-shadow" d={shipment.routePath} />
                    <path className="route-line-active" d={shipment.routePath} pathLength="100" style={{ strokeDasharray: `${shipment.progress} 100` }} />
                  </svg>
                  <button
                    type="button"
                    className="map-marker origin-marker"
                    onClick={() => selectMapEvent(originEventIndex)}
                    style={{ left: "14%", top: "69%" }}
                    aria-label={`View origin: ${shipment.originPort}`}
                  >
                    <MapPin size={14} />
                    <span>{shipment.originCode}</span>
                  </button>
                  <button
                    type="button"
                    className="map-marker current-marker"
                    onClick={() => selectMapEvent(positionEventIndex === -1 ? Math.min(1, destinationEventIndex) : positionEventIndex)}
                    style={{ left: `${shipment.vesselPosition.x}%`, top: `${shipment.vesselPosition.y}%` }}
                    aria-label={`View current location: ${shipment.currentLocation}`}
                  >
                    <span className="marker-pulse" />
                    <Navigation size={14} />
                    <span>{shipment.currentLocation}</span>
                  </button>
                  <button
                    type="button"
                    className="map-marker destination-marker"
                    onClick={() => selectMapEvent(destinationEventIndex)}
                    style={{ left: "88%", top: "25%" }}
                    aria-label={`View destination: ${shipment.destination}`}
                  >
                    <MapPin size={14} />
                    <span>{shipment.destinationCode}</span>
                  </button>
                </div>
              </div>
              <div className="map-legend">
                <span><i className="legend-origin" /> Origin</span>
                <span><i className="legend-current" /> Current position</span>
                <span><i className="legend-destination" /> Destination</span>
              </div>
            </div>

            <aside className="tracking-details">
              <div className="tracking-id-row">
                <div>
                  <span className="card-label">TRACKING CONTAINER</span>
                  <strong>{shipment.id}</strong>
                </div>
                <span className={`shipment-status ${shipment.trackingStatus.toLowerCase().replace(" ", "-")}`}>
                  <span /> {shipment.trackingStatus}
                </span>
              </div>

              <div className="tracking-progress">
                <div className="progress-labels">
                  <span>Route progress</span>
                  <strong>{shipment.progress}%</strong>
                </div>
                <div className="progress-track"><span style={{ width: `${shipment.progress}%` }} /></div>
              </div>

              <div className="tracking-route">
                <div className="route-stop">
                  <span className="route-stop-icon origin"><MapPin size={14} /></span>
                  <div><small>ORIGIN</small><strong>{shipment.originPort}</strong><span>{shipment.originCode}</span></div>
                </div>
                <div className="route-connector" />
                <div className="route-stop">
                  <span className="route-stop-icon destination"><MapPin size={14} /></span>
                  <div><small>DESTINATION</small><strong>{shipment.destination}</strong><span>{shipment.destinationCode}</span></div>
                </div>
              </div>

              <div className="eta-card">
                <div className="eta-icon"><Clock3 size={16} /></div>
                <div><small>ESTIMATED ARRIVAL</small><strong>{shipment.eta}</strong><span>Last update: {shipment.lastUpdate}</span></div>
              </div>

              <button className="tracking-action" type="button" onClick={() => navigateToSection("timeline")}>
                <SearchCheck size={15} /> Inspect shipment events <ChevronRight size={15} />
              </button>
            </aside>
          </div>
        </section>

        <section className="summary-grid">
          <article className="summary-card shipment-card">
            <div className="card-label">
              SELECTED SHIPMENT <span className="tiny-dot" />
            </div>
            <div className="container-id">{shipment.id}</div>
            <div className="route-line">
              <MapPin size={15} /> {shipment.route}
            </div>
            <div className="shipment-meta">
              <span><Package size={14} /> {shipment.containerType}</span>
              <span><Ship size={14} /> {shipment.ship}</span>
            </div>
          </article>

          <article className="summary-card">
            <div className="metric-top">
              <span className="card-label">EVENTS RECORDED</span>
              <div className="metric-icon blue"><Activity size={17} /></div>
            </div>
            <div className="metric-number">
              {events.length}<span className="metric-unit"> events</span>
            </div>
            <div className="metric-foot">
              <ArrowUpRight size={14} className="positive" />
              Versions in this shipment history
            </div>
          </article>

          <article className="summary-card">
            <div className="metric-top">
              <span className="card-label">INTEGRITY STATUS</span>
              <div className="metric-icon green">
                <ShieldCheck size={17} />
              </div>
            </div>
            <div className="metric-number status-number">Review</div>
            <div className="metric-foot">
              <CheckCircle2 size={14} className="positive" />
              Frontend status; backend verification pending
            </div>
          </article>

          <article className="summary-card">
            <div className="metric-top">
              <span className="card-label">SENSOR ALERTS</span>
              <div className="metric-icon orange">
                <Thermometer size={17} />
              </div>
            </div>
            <div className="metric-number">
              {hasSpike ? "01" : "00"}
              <span className="metric-unit"> alert</span>
            </div>
            <div className="metric-foot">
              <span className={hasSpike ? "warning-text" : "positive"}>
                {hasSpike ? "Temperature excursion recorded" : "No spike recorded"}
              </span>
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel timeline-panel" id="timeline">
            <div className="panel-header">
              <div>
                <div className="panel-title">Event history</div>
                <p>Select an event to inspect the shipment state at that moment.</p>
              </div>
              <div className="version-pill">
                <Fingerprint size={14} /> {events.length} versions
              </div>
            </div>

            <div className="timeline-toolbar">
              <div className="tab-list">
                {["Timeline", "Raw events"].map(tab => (
                  <button
                    key={tab}
                    className={activeTab === tab ? "tab active-tab" : "tab"}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tab === "Timeline" ? "Visual timeline" : "Raw event data"}
                  </button>
                ))}
              </div>

              <button
                className="text-button"
                onClick={() => setShowAllEvents(value => !value)}
              >
                {showAllEvents ? "Show recent events" : "View all events"}
                <ChevronRight size={14} />
              </button>
            </div>

            {activeTab === "Timeline" ? (
              <div className="timeline-list">
                {(showAllEvents ? events : events.slice(-3)).map(event => {
                  const Icon = getEventIcon(event.type);
                  const index = events.findIndex(
                    item => item.version === event.version
                  );

                  return (
                    <button
                      key={event.hash}
                      className={`event-row ${
                        currentIndex === index ? "selected-event" : ""
                      }`}
                      onClick={() => selectEvent(index)}
                    >
                      <div className={`event-icon ${event.tone}`}>
                        <Icon size={17} />
                      </div>

                      <div className="event-main">
                        <div className="event-title-line">
                          <strong>{event.title}</strong>
                          {event.type === "TEMPERATURE_SPIKE" && (
                            <span className="alert-badge">ALERT</span>
                          )}
                        </div>
                        <div className="event-type">{event.type}</div>
                        <div className="event-location">
                          <MapPin size={12} /> {event.location}
                        </div>
                        <div className="event-detail">{event.detail}</div>
                      </div>

                      <div className="event-time">
                        <span>{event.date.split(" · ")[0]}</span>
                        <small>{event.date.split(" · ")[1]}</small>
                        <ChevronRight size={15} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="raw-events">
                {events.map(event => (
                  <pre key={event.hash}>
                    {JSON.stringify(event, null, 2)}
                  </pre>
                ))}
              </div>
            )}

            <div className="timeline-footer">
              <span><LockKeyhole size={13} /> Append-only design concept</span>
              <span>Last update: {shipment.lastUpdate}</span>
            </div>
          </article>

          <div className="right-column">
            <article className="panel state-panel">
              <div className="panel-header compact-header">
                <div>
                  <div className="panel-title">Shipment state</div>
                  <p>State reconstructed from the selected event</p>
                </div>
                <span className="state-live"><span /> PREVIEW</span>
              </div>

              <div className="state-location">
                <div className="location-icon"><MapPin size={18} /></div>
                <div>
                  <small>LOCATION AT SELECTED EVENT</small>
                  <strong>{currentEvent.location}</strong>
                  <span>{shipment.status}</span>
                </div>
              </div>

              <div className="state-details">
                <div>
                  <span>Container ID</span>
                  <strong>{shipment.id}</strong>
                </div>
                <div>
                  <span>Event version</span>
                  <strong>v{currentEvent.version}</strong>
                </div>
                <div>
                  <span>Event timestamp</span>
                  <strong>{currentEvent.date.split(" · ")[1]}</strong>
                </div>
                <div>
                  <span>Destination</span>
                  <strong>{shipment.destination}</strong>
                </div>
              </div>

              <div className="state-note">
                <CheckCircle2 size={15} />
                Previewing event {currentIndex + 1} of {events.length}
              </div>
            </article>

            <article className="panel rewind-panel">
              <div className="panel-header compact-header">
                <div>
                    <div className="panel-title">
                    <CalendarClock size={17} /> State scrubbing
                  </div>
                  <p>Move through the history to see how the state changed</p>
                </div>
              </div>

              <div className="rewind-date">
                <span>REPLAY POSITION</span>
                <strong>
                  Event {currentIndex + 1}
                  <small> of {events.length}</small>
                </strong>
              </div>

              <input
                className="rewind-slider"
                type="range"
                min="0"
                max={events.length - 1}
                value={currentIndex}
                onChange={e => selectEvent(Number(e.target.value))}
                aria-label="Rewind event timeline"
              />

              <div className="slider-labels">
                <span>First event</span>
                <span>Latest event</span>
              </div>

              <div className="rewind-current">
                <Clock3 size={14} />
                <span>{currentEvent.date}</span>
              </div>
            </article>
          </div>
        </section>

        <section className="bottom-grid">
          <article className="panel sensor-panel" id="sensors">
            <div className="panel-header">
              <div>
                <div className="panel-title">Temperature monitoring</div>
                <p>Container readings compared with the 8°C safety threshold</p>
              </div>
              <div className="sensor-reading">
                <span className="sensor-dot" />
                <strong>4.3°C</strong>
                <small>Sample current value</small>
              </div>
            </div>

            <div className="chart-legend">
              <span><i /> Temperature (°C)</span>
              <span className="threshold-key"><i /> Safety threshold · 8°C</span>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={temperatureData}
                  margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#238bdf" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#238bdf" stopOpacity={0.015} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#22344a" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#8094ac", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis domain={[0, 12]} ticks={[0, 4, 8, 12]} tick={{ fill: "#8094ac", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={value => [`${value}°C`, "Temperature"]}
                    contentStyle={{ background: "#101925", border: "1px solid #29415b", borderRadius: 6, color: "#edf5ff" }}
                    labelStyle={{ color: "#91a3bb" }}
                  />
                  <ReferenceLine y={8} stroke="#e58b37" strokeDasharray="5 4" />
                  <Area type="monotone" dataKey="temp" stroke="#238bd7" strokeWidth={2.5} fill="url(#tempFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="sensor-alert">
              <AlertTriangle size={16} />
              <div>
                <strong>Temperature excursion recorded</strong>
                <span>
                  Sample peak: 9.4°C. Select the related event to inspect its details.
                </span>
              </div>
              <button onClick={reviewTemperatureEvent}>
                Review event <ChevronRight size={14} />
              </button>
            </div>
          </article>

          <article className="panel integrity-panel" id="integrity">
            <div className="panel-header">
              <div>
                <div className="panel-title">Audit integrity</div>
                <p>What is confirmed in the interface and what needs the backend</p>
              </div>
              <div className="integrity-shield">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="integrity-score">
              <div className={`score-ring ${integrityCheck.status}`}>
                {integrityCheck.status === "verified" ? <CheckCircle2 size={23} /> : <span>—</span>}
              </div>
              <div>
                <strong>
                  {integrityCheck.status === "verified"
                    ? "Verification passed"
                    : "Verification pending"}
                </strong>
                <p>
                  {integrityCheck.status === "verified"
                    ? "The selected event and its chain links passed the sample check."
                    : "Run a check to inspect the selected event record."}
                </p>
              </div>
            </div>

            <div className="integrity-check-action">
              <button type="button" onClick={runIntegrityCheck}>
                <ShieldCheck size={15} />
                {integrityCheck.status === "verified" ? "Run check again" : "Run integrity check"}
              </button>
              {integrityCheck.checkedAt && (
                <span>Checked {integrityCheck.checkedAt}</span>
              )}
            </div>

            <div className="integrity-hashes">
              <div>
                <span>SELECTED EVENT HASH</span>
                <code>{currentEvent.hash}</code>
              </div>
              <div>
                <span>PREVIOUS EVENT HASH</span>
                <code>{previousEvent?.hash || "GENESIS · No previous event"}</code>
              </div>
            </div>

            <div className="integrity-list">
              <div>
                <CheckCircle2 size={16} />
                <span>Event versions displayed</span>
                <strong>UI</strong>
              </div>
              <div>
                <CheckCircle2 size={16} />
                <span>Event timestamps displayed</span>
                <strong>UI</strong>
              </div>
              <div>
                <LockKeyhole size={16} />
                <span>Append-only enforcement</span>
                <strong>Backend</strong>
              </div>
              <div>
                <Fingerprint size={16} />
                <span>Cryptographic signatures</span>
                <strong>Backend</strong>
              </div>
            </div>

            <div className="integrity-foot">
              <Fingerprint size={15} />
              <span>Latest sample fingerprint</span>
              <code>{events[events.length - 1].hash}</code>
            </div>

            <p className="demo-disclaimer">
              Sample interface only. Production verification requires backend
              generated hashes, signatures, and immutable storage.
            </p>
          </article>
        </section>

        <footer className="footer">
          <span>© 2026 AuditTrail Ledger</span>
          <span><LockKeyhole size={12} /> Event-sourced logistics monitoring</span>
          <span>Frontend demo · Sample data</span>
        </footer>
      </main>

      {isSetupOpen && (
        <div className="setup-overlay" role="presentation" onMouseDown={e => {
          if (e.target === e.currentTarget) setIsSetupOpen(false);
        }}>
          <section className="setup-modal" role="dialog" aria-modal="true" aria-labelledby="setup-title">
            <button className="setup-close" onClick={() => setIsSetupOpen(false)} aria-label="Close workspace setup">
              <X size={17} />
            </button>
            <div className="setup-glow setup-glow-one" />
            <div className="setup-glow setup-glow-two" />
            <div className="setup-content">
              <div className="setup-brand">
                <span><Target size={15} /></span>
                AuditTrail
              </div>
              <div className="setup-progress" aria-label={`Step ${setupStep + 1} of ${setupQuestions.length}`}>
                {setupQuestions.map((_, index) => (
                  <span key={index} className={index <= setupStep ? "complete" : ""} />
                ))}
              </div>
              <div className="setup-eyebrow">{setupQuestions[setupStep].eyebrow}</div>
              <h2 id="setup-title">{setupQuestions[setupStep].title}</h2>
              <p className="setup-description">{setupQuestions[setupStep].description}</p>
              {setupQuestions[setupStep].multiSelect && (
                <div className="preference-toolbar">
                  <span>{setupChoices.preferences.length} selected</span>
                  <button onClick={setAllPreferences}>
                    {setupChoices.preferences.length === setupQuestions[2].options.length ? "Clear all" : "Select all"}
                  </button>
                </div>
              )}
              <div className={setupQuestions[setupStep].multiSelect ? "setup-options preference-options" : "setup-options"}>
                {setupQuestions[setupStep].options.map(option => {
                  const Icon = option.icon;
                  const selected = setupQuestions[setupStep].multiSelect
                    ? setupChoices.preferences.includes(option.label)
                    : setupChoices[setupQuestions[setupStep].key] === option.label;
                  return (
                    <button
                      key={option.label}
                      className={selected ? "setup-option selected" : "setup-option"}
                      onClick={() => selectSetupChoice(setupQuestions[setupStep].key, option.label)}
                      aria-pressed={selected}
                    >
                      <span className="setup-option-icon"><Icon size={16} /></span>
                      <span className="setup-option-copy">
                        <strong>{option.label}</strong>
                        <small>{option.detail}</small>
                      </span>
                      {option.badge && <span className="setup-option-badge">{option.badge}</span>}
                      <span className="setup-radio">{selected && <CheckCircle2 size={16} />}</span>
                    </button>
                  );
                })}
              </div>
              <button className="setup-continue" onClick={continueSetup}>
                {setupStep === setupQuestions.length - 1 ? "Apply preferences" : "Continue"}
                <ChevronRight size={16} />
              </button>
              <button className="setup-skip" onClick={() => setIsSetupOpen(false)}>Skip for now</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
