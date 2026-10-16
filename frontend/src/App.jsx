
import { useState } from "react";
import {
  Activity, AlertTriangle, Anchor, ArrowUpRight, Box,
  CalendarClock, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, Clock3, Download, Fingerprint, GitBranch,
  Layers3, LockKeyhole, MapPin, Package, Search,
  ShieldCheck, Ship, Thermometer, Waves
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
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [notice, setNotice] = useState("");

  const shipment = shipments[activeId];
  const events = shipment.events;
  const currentIndex = Math.min(selectedEvent, events.length - 1);
  const currentEvent = events[currentIndex];
  const hasSpike = events.some(
    event => event.type === "TEMPERATURE_SPIKE"
  );

  function inspectShipment(e) {
    e.preventDefault();
    const id = query.trim().toUpperCase();

    if (shipments[id]) {
      setActiveId(id);
      setSelectedEvent(0);
      setShowAllEvents(true);
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
    setShowAllEvents(true);
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
      setSelectedEvent(index);
      document.getElementById("timeline")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
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
          <a className="nav-item active" href="#overview">
            <Layers3 size={18} /> Overview
          </a>
          <a className="nav-item" href="#timeline">
            <Activity size={18} /> Event timeline
            <span className="nav-count">{events.length}</span>
          </a>
          <a className="nav-item" href="#containers">
            <Box size={18} /> Containers
          </a>
          <a className="nav-item" href="#sensors">
            <Waves size={18} /> Sensor analytics
          </a>
          <a className="nav-item" href="#integrity">
            <ShieldCheck size={18} /> Integrity audit
          </a>
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
            <strong>Forensic dashboard</strong>
          </div>

          <div className="topbar-right">
            <span className="live-dot" />
            <span className="live-label">Dashboard online</span>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
            <div className="avatar small">LM</div>
          </div>
        </header>

        <section className="page-heading" id="overview">
          <div>
            <div className="eyebrow">
              EVENT SOURCING / COMMAND CENTER
            </div>
            <h1>Forensic dashboard</h1>
            <p>
              Reconstruct shipment state. Inspect every event.
              Keep a traceable history of your logistics operations.
            </p>
          </div>

          <button className="button button-secondary" onClick={exportAudit}>
            <Download size={16} /> Export audit log
          </button>
        </section>

        <section className="search-panel" id="containers">
          <div className="search-intro">
            <div className="search-symbol">
              <Search size={19} />
            </div>
            <div>
              <strong>Look up a shipment</strong>
              <p>
                Search by container ID to inspect its historical event stream.
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
            TRY A SAMPLE:
            <button onClick={() => chooseShipment("CONT-2026-0842")}>
              CONT-2026-0842
            </button>
            <button onClick={() => chooseShipment("CONT-2026-0197")}>
              CONT-2026-0197
            </button>
          </div>

          {notice && <div className="search-notice">{notice}</div>}
        </section>

        <section className="summary-grid">
          <article className="summary-card shipment-card">
            <div className="card-label">
              TRACKING CONTAINER <span className="tiny-dot" />
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
              Event versions recorded
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
              UI checks only; backend verification pending
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
                <div className="panel-title">Event timeline</div>
                <p>Chronological history of shipment events</p>
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
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                className="text-button"
                onClick={() => setShowAllEvents(value => !value)}
              >
                {showAllEvents ? "Show recent" : "View all events"}
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
                      onClick={() => setSelectedEvent(index)}
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
                  <div className="panel-title">Reconstructed state</div>
                  <p>Preview based on the selected event</p>
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
                  <p>Move backward and forward through the event history</p>
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
                onChange={e => setSelectedEvent(Number(e.target.value))}
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
                <div className="panel-title">Cold-chain sensor analytics</div>
                <p>Illustrative container temperature readings</p>
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
                  <CartesianGrid stroke="#edf1f5" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#8b96a5", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis domain={[0, 12]} ticks={[0, 4, 8, 12]} tick={{ fill: "#8b96a5", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={value => [`${value}°C`, "Temperature"]} />
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
                <div className="panel-title">Integrity &amp; provenance</div>
                <p>Audit verification overview</p>
              </div>
              <div className="integrity-shield">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="integrity-score">
              <div className="score-ring">
                <span>UI</span>
              </div>
              <div>
                <strong>Verification pending</strong>
                <p>Connect backend checks for trusted results.</p>
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
              Sample interface only. Real integrity requires backend-generated
              hashes, signatures, and immutable storage.
            </p>
          </article>
        </section>

        <footer className="footer">
          <span>© 2026 AuditTrail Ledger</span>
          <span><LockKeyhole size={12} /> Event-sourced logistics monitoring</span>
          <span>Frontend demo · Sample data</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
