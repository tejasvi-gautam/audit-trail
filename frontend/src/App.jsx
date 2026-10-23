
import { useEffect, useRef, useState } from "react";
import {
  Activity, AlertTriangle, Anchor, ArrowUpRight, Bell, Box,
  CalendarClock, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, Clock3, Download, Fingerprint, GitBranch,
  Layers3, LockKeyhole, MapPin, MapPinned, Package, Search,
  Navigation, Route, SearchCheck,
  ShieldCheck, Ship, Sparkles, Target, Thermometer, Waves, X, Command,
  CheckCheck, CircleAlert, SlidersHorizontal, Clipboard, FileText,
  RotateCcw, Play, Pause, SkipBack, SkipForward, History
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine,
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
    plannedProgress: 72,
    etaPrediction: {
      risk: "Medium",
      revisedEta: "Oct 23, 2026 · 02:00 UTC",
      reasons: ["Temperature excursion", "4 hours behind planned route progress"],
      rule: "Medium risk: actual progress is more than 3 points behind plan or a sensor excursion is recorded."
    },
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
    plannedProgress: 90,
    etaPrediction: {
      risk: "High",
      revisedEta: "Oct 25, 2026 · 16:00 UTC",
      reasons: ["Customs review hold", "8 hours behind planned route progress"],
      rule: "High risk: actual progress is more than 6 points behind plan or the shipment is delayed."
    },
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

const alerts = [
  {
    id: "alert-temp-0842",
    shipmentId: "CONT-2026-0842",
    type: "Temperature",
    severity: "critical",
    title: "Temperature exceeded safe limits",
    detail: "Sensor reached 9.4°C, above the 8°C safety threshold.",
    timestamp: "Oct 14, 2026 · 03:18 UTC",
    eventIndex: 2,
    targetSection: "timeline"
  },
  {
    id: "alert-integrity-0842",
    shipmentId: "CONT-2026-0842",
    type: "Integrity",
    severity: "critical",
    title: "Integrity check failed",
    detail: "Event hash does not match the previous ledger link. Review before release.",
    timestamp: "Today · 10:42 UTC",
    eventIndex: 2,
    targetSection: "integrity"
  },
  {
    id: "alert-delay-0197",
    shipmentId: "CONT-2026-0197",
    type: "Delay",
    severity: "warning",
    title: "Shipment arrival delayed",
    detail: "Customs review is holding the container at the destination port.",
    timestamp: "Today · 09:16 UTC",
    eventIndex: 2,
    targetSection: "timeline"
  },
  {
    id: "alert-integrity-0197",
    shipmentId: "CONT-2026-0197",
    type: "Integrity",
    severity: "critical",
    title: "Integrity check failed",
    detail: "A handoff record is missing from the event chain. Verification is required.",
    timestamp: "Today · 09:18 UTC",
    eventIndex: 2,
    targetSection: "integrity"
  }
];

const monthlyShipmentTrends = [
  { month: "May", shipments: 18, onTime: 15, delayed: 3 },
  { month: "Jun", shipments: 24, onTime: 20, delayed: 4 },
  { month: "Jul", shipments: 29, onTime: 24, delayed: 5 },
  { month: "Aug", shipments: 36, onTime: 31, delayed: 5 },
  { month: "Sep", shipments: 42, onTime: 35, delayed: 7 },
  { month: "Oct", shipments: 48, onTime: 39, delayed: 9 }
];

const deliveryPerformance = [
  { status: "On time", shipments: 164 },
  { status: "Delayed", shipments: 33 }
];

const demoShipmentRows = [
  {
    id: "CONT-2026-0842",
    route: "Shanghai → Rotterdam",
    status: "In Transit",
    progress: 68,
    eta: "Oct 22 · 14:00",
    risk: "Medium",
    temperature: "4.3°C",
    integrity: "Pending",
    lastUpdate: "10:42 UTC",
    delay: 4
  },
  {
    id: "CONT-2026-0197",
    route: "Mumbai → Hamburg",
    status: "Delayed",
    progress: 82,
    eta: "Oct 25 · 16:00",
    risk: "High",
    temperature: "5.1°C",
    integrity: "Failed",
    lastUpdate: "09:16 UTC",
    delay: 8
  },
  {
    id: "CONT-2026-0731",
    route: "Busan → Long Beach",
    status: "Delivered",
    progress: 100,
    eta: "Oct 18 · 11:20",
    risk: "Low",
    temperature: "3.9°C",
    integrity: "Verified",
    lastUpdate: "Oct 18 · 11:20",
    delay: 0
  },
  {
    id: "CONT-2026-0618",
    route: "Singapore → Felixstowe",
    status: "In Transit",
    progress: 44,
    eta: "Oct 29 · 07:45",
    risk: "Low",
    temperature: "4.0°C",
    integrity: "Verified",
    lastUpdate: "08:55 UTC",
    delay: 0
  }
];

const recentActivity = [
  { type: "Temperature alert", detail: "CONT-2026-0842 reached 9.4°C", time: "18 min ago", tone: "critical" },
  { type: "Port arrival", detail: "CONT-2026-0197 arrived at Hamburg", time: "1 hr ago", tone: "success" },
  { type: "Position update", detail: "CONT-2026-0842 position validated", time: "2 hrs ago", tone: "info" },
  { type: "Integrity review", detail: "CONT-2026-0197 requires verification", time: "3 hrs ago", tone: "warning" }
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

function getEventId(shipmentId, event) {
  return `${shipmentId}-EVT-${String(event.version).padStart(3, "0")}`;
}

function getPreviousState(events, index) {
  if (index === 0) return "Genesis state · No previous event";
  return `After "${events[index - 1].title}" · v${events[index - 1].version}`;
}

function getShipmentState(events, index) {
  const state = {
    location: "Shipment origin",
    temperature: "4°C",
    status: "Created",
    custody: "Manifest sealed"
  };

  events.slice(0, index + 1).forEach(event => {
    state.location = event.location;

    if (event.type === "TEMPERATURE_SPIKE") {
      state.temperature = "9.4°C";
      state.status = "Temperature alert";
    }
    if (event.type === "TEMP_NORMALIZED") {
      state.temperature = "4.3°C";
      state.status = "In transit";
    }
    if (event.type === "LOADED_ON_SHIP") {
      state.status = "In transit";
      state.custody = "Loaded onto vessel";
    }
    if (event.type === "VESSEL_POSITION_UPDATED") {
      state.custody = "Vessel tracking active";
    }
    if (event.type === "ARRIVED_AT_PORT") {
      state.status = "Customs review";
      state.custody = "Destination port intake";
    }
  });

  return state;
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
  const [chainVerification, setChainVerification] = useState({
    status: "pending",
    failedIndex: null,
    tampered: false
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
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [activeCommand, setActiveCommand] = useState(0);
  const commandInputRef = useRef(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alertFilter, setAlertFilter] = useState("All");
  const [readAlertIds, setReadAlertIds] = useState([]);
  const [timelineQuery, setTimelineQuery] = useState("");
  const [timelineSeverity, setTimelineSeverity] = useState("All");
  const [shipmentTableQuery, setShipmentTableQuery] = useState("");
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState("All");
  const [shipmentRiskFilter, setShipmentRiskFilter] = useState("All");
  const [shipmentSort, setShipmentSort] = useState("delay");
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState("1x");
  const [replayMode, setReplayMode] = useState("historical");
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState("Investigating");

  const shipment = shipments[activeId];
  const events = shipment.events;
  const progressDelta = shipment.progress - shipment.plannedProgress;
  const currentIndex = Math.min(selectedEvent, events.length - 1);
  const currentEvent = events[currentIndex];
  const previousEvent = events[currentIndex - 1];
  const chainRows = events.map((event, index) => ({
    event,
    index,
    previousHash: index === 0 ? "GENESIS" : events[index - 1].hash,
    currentHash: chainVerification.tampered && index === 2
      ? "TAMPERED-9a31...44f0"
      : event.hash
  }));
  const beforeState = currentIndex === 0
    ? getShipmentState([], -1)
    : getShipmentState(events, currentIndex - 1);
  const afterState = getShipmentState(events, currentIndex);
  const stateComparisons = [
    { label: "Location", before: beforeState.location, after: afterState.location },
    { label: "Temperature", before: beforeState.temperature, after: afterState.temperature },
    { label: "Shipment status", before: beforeState.status, after: afterState.status },
    { label: "Custody", before: beforeState.custody, after: afterState.custody }
  ];
  const changedStateComparisons = stateComparisons.filter(
    comparison => comparison.before !== comparison.after
  );
  const hasSpike = events.some(
    event => event.type === "TEMPERATURE_SPIKE"
  );
  const activeDemoShipment = demoShipmentRows.find(row => row.id === activeId);
  const incidentIsTemperature = hasSpike;
  const incidentTitle = incidentIsTemperature ? "Temperature spike detected" : "Shipment arrival delayed";
  const incidentDescription = incidentIsTemperature
    ? "Sensor excursion recorded during transit and linked to a delivery delay."
    : "Customs review is holding the shipment at the destination port.";
  const incidentSeverity = incidentIsTemperature ? shipment.etaPrediction.risk : "High";
  const filteredAlerts = alerts.filter(alert =>
    alertFilter === "All" || alert.type === alertFilter
  );
  const filteredEvents = events.filter(event => {
    const matchesQuery = `${event.type} ${event.title} ${event.location} ${event.detail}`
      .toLowerCase()
      .includes(timelineQuery.toLowerCase());
    const severity = event.tone === "red" ? "Critical" : event.tone === "green" ? "Success" : "Info";
    return matchesQuery && (timelineSeverity === "All" || severity === timelineSeverity);
  });
  const filteredShipmentRows = demoShipmentRows
    .filter(row => `${row.id} ${row.route} ${row.status}`.toLowerCase().includes(shipmentTableQuery.toLowerCase()))
    .filter(row => shipmentStatusFilter === "All" || row.status === shipmentStatusFilter)
    .filter(row => shipmentRiskFilter === "All" || row.risk === shipmentRiskFilter)
    .sort((a, b) => shipmentSort === "eta"
      ? a.eta.localeCompare(b.eta)
      : shipmentSort === "progress"
        ? b.progress - a.progress
        : b.delay - a.delay);
  const unreadAlertCount = alerts.filter(
    alert => !readAlertIds.includes(alert.id)
  ).length;
  const shipmentStatusTotals = [
    { status: "In transit", shipments: Object.values(shipments).filter(item => item.status === "In transit").length },
    { status: "Customs review", shipments: Object.values(shipments).filter(item => item.status === "Customs review").length },
    { status: "Delivered", shipments: 38 },
    { status: "Booked", shipments: 24 }
  ];
  const totalShipments = shipmentStatusTotals.reduce((total, item) => total + item.shipments, 0);
  const delayedShipments = demoShipmentRows.filter(row => row.delay > 0);
  const integrityFailures = demoShipmentRows.filter(row => row.integrity === "Failed");
  const pendingIntegrityChecks = demoShipmentRows.filter(row => row.integrity === "Pending");

  const commandActions = [
    {
      id: "find-container",
      label: "Find a container",
      description: "Search by container ID and inspect its shipment",
      icon: Search,
      shortcut: "F",
      run: () => {
        setIsCommandOpen(false);
        document.getElementById("containers")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => document.querySelector(".search-form input")?.focus(), 350);
      }
    },
    {
      id: "open-timeline",
      label: "Open event timeline",
      description: "Review every change in chronological order",
      icon: Activity,
      shortcut: "T",
      run: () => {
        setIsCommandOpen(false);
        navigateToSection("timeline");
      }
    },
    {
      id: "open-integrity",
      label: "Go to integrity verification",
      description: "Verify the selected event and its chain links",
      icon: ShieldCheck,
      shortcut: "I",
      run: () => {
        setIsCommandOpen(false);
        navigateToSection("integrity");
      }
    },
    {
      id: "open-analytics",
      label: "Open smart analytics",
      description: "Review trends, delivery performance, and reports",
      icon: Activity,
      shortcut: "A",
      run: () => {
        setIsCommandOpen(false);
        navigateToSection("analytics");
      }
    }
  ];

  const filteredCommands = commandActions.filter(action =>
    `${action.label} ${action.description}`.toLowerCase().includes(commandQuery.toLowerCase())
  );

  useEffect(() => {
    function handleGlobalKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen(true);
        setCommandQuery("");
        setActiveCommand(0);
      }

      if (event.key === "Escape") {
        setIsCommandOpen(false);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandOpen) commandInputRef.current?.focus();
  }, [isCommandOpen]);

  useEffect(() => {
    if (!isReplayPlaying) return undefined;
    const interval = window.setInterval(() => {
      setSelectedEvent(index => {
        if (index >= events.length - 1) {
          setIsReplayPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, replaySpeed === "2x" ? 650 : replaySpeed === "0.5x" ? 1800 : 1200);
    return () => window.clearInterval(interval);
  }, [isReplayPlaying, replaySpeed, events.length]);

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

  function exportAuditCsv() {
    const rows = [
      ["Shipment ID", "Event ID", "Type", "Version", "Timestamp", "Location", "Hash"],
      ...events.map(event => [shipment.id, getEventId(shipment.id, event), event.type, event.version, event.date, event.location, event.hash])
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${shipment.id}-audit-trail.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportAnalyticsCsv() {
    const rows = [
      ["Metric", "Category", "Value"],
      ...shipmentStatusTotals.map(item => ["Shipments by status", item.status, item.shipments]),
      ...monthlyShipmentTrends.map(item => ["Monthly trend", item.month, item.shipments]),
      ...deliveryPerformance.map(item => ["Delivery performance", item.status, item.shipments]),
      ["Average delivery time", "All shipments", "6.8 days"]
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audittrail-analytics-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportIncidentReport() {
    const report = [
      "AUDITTRAIL INCIDENT INVESTIGATION REPORT",
      `Incident: ${shipment.id}`,
      `Generated: ${new Date().toISOString()}`,
      `Incident: ${incidentTitle}`,
      `Severity: ${incidentSeverity}`,
      `Status: ${resolutionStatus}`,
      `Route: ${shipment.route}`,
      `Current location: ${shipment.currentLocation}`,
      `Actual progress: ${shipment.progress}%`,
      `Planned progress: ${shipment.plannedProgress}%`,
      `Current temperature: ${activeDemoShipment?.temperature || "4.3°C"}`,
      incidentIsTemperature ? "Peak temperature: 9.4°C" : `Delay duration: ${activeDemoShipment?.delay || 8} hours`,
      `Investigation notes: ${investigationNotes || "No notes added."}`,
      "",
      "EVENT EVIDENCE",
      ...events.map(event => `${event.date} | ${event.type} | ${event.location} | ${event.detail} | ${event.hash}`)
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${shipment.id}-incident-report.txt`;
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

  function getSetupLanding() {
    const preferenceLanding = {
      "Shipment alerts": "alerts",
      "Sensor insights": "sensors",
      "Audit exports": "analytics",
      "Daily operations digest": "overview"
    };
    const discoveryLanding = {
      "Shipment tracking": "tracking",
      "Event history": "timeline",
      "Sensor monitoring": "sensors",
      "Just exploring": "overview"
    };
    const selectedPreference = setupChoices.preferences.find(
      preference => preferenceLanding[preference]
    );

    return selectedPreference
      ? preferenceLanding[selectedPreference]
      : discoveryLanding[setupChoices.discovery] || "overview";
  }

  function landOnSetupDestination(destination) {
    if (destination === "alerts") {
      setIsAlertsOpen(true);
      setActiveSection("overview");
      return;
    }
    setIsAlertsOpen(false);
    navigateToSection(destination);
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
    const destination = getSetupLanding();
    window.setTimeout(() => landOnSetupDestination(destination), 120);
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

  function moveReplay(step) {
    setIsReplayPlaying(false);
    setSelectedEvent(index => Math.max(0, Math.min(events.length - 1, index + step)));
    setIntegrityCheck({ status: "pending", checkedAt: "" });
  }

  function resetReplay() {
    setIsReplayPlaying(false);
    setSelectedEvent(0);
    setReplayMode("historical");
    setIntegrityCheck({ status: "pending", checkedAt: "" });
  }

  function copyValue(value, label) {
    if (!navigator.clipboard) {
      setNotice(`Unable to copy ${label.toLowerCase()} in this browser.`);
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      setNotice(`${label} copied to clipboard.`);
    }).catch(() => {
      setNotice(`Unable to copy ${label.toLowerCase()}.`);
    });
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

  function verifyEventChain(tampered = chainVerification.tampered) {
    const failedIndex = tampered && events.length > 2 ? 2 : null;
    setChainVerification({
      status: failedIndex === null ? "verified" : "failed",
      failedIndex,
      tampered
    });
  }

  function toggleTamperSimulation() {
    setChainVerification(current => ({
      status: "pending",
      failedIndex: null,
      tampered: !current.tampered
    }));
  }

  function selectMapEvent(index) {
    selectEvent(index);
    navigateToSection("timeline");
  }

  function markAlertRead(alertId) {
    setReadAlertIds(current => current.includes(alertId) ? current : [...current, alertId]);
  }

  function openAlert(alert) {
    markAlertRead(alert.id);
    setIsAlertsOpen(false);
    if (alert.shipmentId !== activeId) {
      chooseShipment(alert.shipmentId);
    }
    selectEvent(alert.eventIndex);
    navigateToSection(alert.targetSection);
  }

  function markAllAlertsRead() {
    setReadAlertIds(current => [
      ...new Set([...current, ...alerts.map(alert => alert.id)])
    ]);
  }

  function handleCommandKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveCommand(index => Math.min(index + 1, filteredCommands.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveCommand(index => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && filteredCommands[activeCommand]) {
      event.preventDefault();
      filteredCommands[activeCommand].run();
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
          <button
            className={activeSection === "overview" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("overview")}
            title="Fleet command center"
            type="button"
          >
            <Layers3 size={18} /> Command center
          </button>
          <button
            className={activeSection === "analytics" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("analytics")}
            title="Smart analytics"
            type="button"
          >
            <Activity size={18} /> Smart analytics
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
            className={activeSection === "incident" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("incident")}
            title="Incident investigation workspace"
            type="button"
          >
            <CircleAlert size={18} /> Incident investigation
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
            className={activeSection === "replay" ? "nav-item active" : "nav-item"}
            onClick={() => navigateToSection("replay")}
            title="Audit Trail Replay Studio"
            type="button"
          >
            <History size={18} /> Replay studio
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
            <strong>Logistics control tower</strong>
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
            <div className="alerts-anchor">
              <button
                className={isAlertsOpen ? "icon-button alert-trigger active" : "icon-button alert-trigger"}
                type="button"
                onClick={() => setIsAlertsOpen(value => !value)}
                aria-label={`${unreadAlertCount} unread alerts`}
                aria-expanded={isAlertsOpen}
              >
                <Bell size={17} />
                {unreadAlertCount > 0 && <span className="alert-count">{unreadAlertCount}</span>}
              </button>
              {isAlertsOpen && (
                <section className="alerts-panel" aria-label="Notification center">
                  <div className="alerts-header">
                    <div>
                      <strong>Notification center</strong>
                      <span>{unreadAlertCount ? `${unreadAlertCount} unread across all shipments` : "All caught up"}</span>
                    </div>
                    <button type="button" onClick={markAllAlertsRead} disabled={!unreadAlertCount}>
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  </div>
                  <div className="alerts-filters" role="group" aria-label="Filter alerts">
                    {["All", "Delay", "Temperature", "Integrity"].map(filter => (
                      <button
                        key={filter}
                        type="button"
                        className={alertFilter === filter ? "active" : ""}
                        onClick={() => setAlertFilter(filter)}
                      >
                        {filter === "All" && <SlidersHorizontal size={11} />}
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="alerts-list">
                    {filteredAlerts.length ? filteredAlerts.map(alert => (
                      <button
                        key={alert.id}
                        type="button"
                        className={readAlertIds.includes(alert.id) ? "alert-item read" : "alert-item"}
                        onClick={() => openAlert(alert)}
                      >
                        <span className={`alert-severity ${alert.severity}`}>
                          {alert.severity === "critical" ? <CircleAlert size={15} /> : <Bell size={14} />}
                        </span>
                        <span className="alert-copy">
                          <span className="alert-title-row">
                            <strong>{alert.title}</strong>
                            <em>{alert.severity}</em>
                          </span>
                          <small>{alert.detail}</small>
                          <span className="alert-meta">{alert.type} · {alert.timestamp}</span>
                        </span>
                        {!readAlertIds.includes(alert.id) && <span className="unread-dot" />}
                      </button>
                    )) : (
                      <div className="alerts-empty">No alerts match this filter.</div>
                    )}
                  </div>
                </section>
              )}
            </div>
            <button
              className="command-trigger"
              type="button"
              onClick={() => {
                setIsCommandOpen(true);
                setCommandQuery("");
                setActiveCommand(0);
              }}
              aria-label="Open quick search"
            >
              <Search size={14} />
              <span>Quick search</span>
              <kbd>Ctrl K</kbd>
            </button>
            <div className="avatar small">LM</div>
          </div>
        </header>

        <section className="page-heading" id="overview">
          <div>
            <div className="eyebrow">
              LOGISTICS CONTROL TOWER
            </div>
            <h1>Command center for the demo fleet</h1>
            <p>
              Monitor fleet health, delivery performance, conditions, and ledger integrity from one operational view.
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
            <button className="button button-secondary" onClick={exportAuditCsv}>
              <FileText size={16} /> CSV
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

        <section className="command-center" aria-label="Fleet command center">
          <div className="command-center-header">
            <div>
              <div className="eyebrow">LOGISTICS CONTROL TOWER</div>
              <h2>Fleet command center</h2>
              <p>One view of the signals that need your attention across the demo fleet.</p>
            </div>
            <span className="simulated-badge"><span className="simulated-dot" /> SIMULATED DATA · UPDATED JUST NOW</span>
          </div>

          <div className="command-metrics">
            <article className="command-metric health">
              <div className="command-metric-top"><span>Fleet health score</span><div className="command-metric-icon"><ShieldCheck size={16} /></div></div>
              <strong>86<span>/100</span></strong>
              <div className="health-bar"><span style={{ width: "86%" }} /></div>
              <small><ArrowUpRight size={12} /> 4.2% vs last week</small>
            </article>
            <article className="command-metric">
              <div className="command-metric-top"><span>On-time delivery</span><div className="command-metric-icon"><Clock3 size={16} /></div></div>
              <strong>83.2<span>%</span></strong>
              <small className="metric-note"><span className="status-dot green" /> 164 of 197 shipments on time</small>
            </article>
            <article className="command-metric warning">
              <div className="command-metric-top"><span>Delayed shipments</span><div className="command-metric-icon"><AlertTriangle size={16} /></div></div>
              <strong>9</strong>
              <small className="metric-note"><span className="status-dot amber" /> 4 require attention now</small>
            </article>
            <article className="command-metric critical">
              <div className="command-metric-top"><span>Critical temperature alerts</span><div className="command-metric-icon"><Thermometer size={16} /></div></div>
              <strong>3</strong>
              <small className="metric-note"><span className="status-dot red" /> 1 active excursion</small>
            </article>
          </div>

          <div className="command-center-grid">
            <article className="command-card attention-card">
              <div className="command-card-header">
                <div><span className="command-card-kicker">ATTENTION QUEUE</span><h3>Delayed shipments</h3></div>
                <span className="command-card-count warning-count">9</span>
              </div>
              <div className="attention-list">
                {delayedShipments.map(row => (
                  <button key={row.id} type="button" className="attention-item" onClick={() => chooseShipment(row.id)}>
                    <span className="attention-icon"><AlertTriangle size={14} /></span>
                    <span className="attention-copy"><strong>{row.id}</strong><small>{row.route}</small></span>
                    <span className="attention-delay">+{row.delay}h <ChevronRight size={14} /></span>
                  </button>
                ))}
              </div>
              <button type="button" className="command-card-link" onClick={() => navigateToSection("containers")}>View all shipment risks <ArrowUpRight size={13} /></button>
            </article>

            <article className="command-card temperature-card">
              <div className="command-card-header">
                <div><span className="command-card-kicker">CONDITION MONITORING</span><h3>Temperature alerts</h3></div>
                <span className="critical-label"><span /> 1 active</span>
              </div>
              <div className="temperature-alert-main">
                <div className="temperature-alert-icon"><Thermometer size={20} /></div>
                <div><strong>9.4°C</strong><span>CONT-2026-0842 · North Atlantic Ocean</span></div>
                <span className="severity-pill critical">CRITICAL</span>
              </div>
              <div className="temperature-threshold"><span>Safety threshold</span><strong>8.0°C</strong></div>
              <button type="button" className="command-card-link" onClick={() => { reviewTemperatureEvent(); }}>Inspect sensor event <ArrowUpRight size={13} /></button>
            </article>

            <article className="command-card integrity-card">
              <div className="command-card-header">
                <div><span className="command-card-kicker">LEDGER INTEGRITY</span><h3>Checks requiring review</h3></div>
                <Fingerprint size={18} />
              </div>
              <div className="integrity-summary">
                <div><strong>2</strong><span>Failed</span></div>
                <div><strong>5</strong><span>Pending</span></div>
                <div><strong>41</strong><span>Verified</span></div>
              </div>
              <div className="integrity-queue">
                {integrityFailures.map(row => (
                  <button key={row.id} type="button" onClick={() => chooseShipment(row.id)}><span className="status-dot red" /><span>{row.id}</span><strong>Failed <ChevronRight size={13} /></strong></button>
                ))}
                {pendingIntegrityChecks.map(row => (
                  <button key={row.id} type="button" onClick={() => chooseShipment(row.id)}><span className="status-dot amber" /><span>{row.id}</span><strong>Pending <ChevronRight size={13} /></strong></button>
                ))}
              </div>
              <button type="button" className="command-card-link" onClick={() => navigateToSection("integrity")}>Open integrity audit <ArrowUpRight size={13} /></button>
            </article>

            <article className="command-card activity-card">
              <div className="command-card-header">
                <div><span className="command-card-kicker">ACTIVITY STREAM</span><h3>What just happened</h3></div>
                <span className="simulated-inline"><span /> SIMULATED</span>
              </div>
              <div className="command-activity-list">
                {recentActivity.map(item => (
                  <button key={item.type} type="button" className="command-activity-item" onClick={() => {
                    if (item.type === "Temperature alert") reviewTemperatureEvent();
                    else navigateToSection("timeline");
                  }}>
                    <span className={`activity-dot ${item.tone}`} />
                    <span><strong>{item.type}</strong><small>{item.detail}</small></span>
                    <time>{item.time}</time>
                  </button>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="incident-workspace panel" id="incident" aria-label="Incident investigation workspace">
          <div className="incident-header">
            <div>
              <div className="eyebrow">FORENSIC OPERATIONS · INCIDENT WORKSPACE</div>
              <h2>Investigate an active incident</h2>
              <p>Assemble the route, sensor, and ledger evidence needed to resolve a shipment exception.</p>
            </div>
            <div className="incident-header-actions">
              <span className={`incident-status ${resolutionStatus.toLowerCase().replace(" ", "-")}`}><span /> {resolutionStatus}</span>
              <button type="button" className="button button-secondary" onClick={exportIncidentReport}><Download size={14} /> Export incident report</button>
            </div>
          </div>

          <div className="incident-selector">
            <span>INVESTIGATING SHIPMENT</span>
            {Object.values(shipments).map(item => (
              <button key={item.id} type="button" className={activeId === item.id ? "active" : ""} onClick={() => chooseShipment(item.id)}>
                <span className="status-dot" />
                <strong>{item.id}</strong>
                <small>{item.route}</small>
              </button>
            ))}
          </div>

          <div className="incident-summary">
            <div className="incident-summary-title">
              <div className="incident-severity-icon">{incidentIsTemperature ? <Thermometer size={20} /> : <AlertTriangle size={20} />}</div>
              <div><span className="command-card-kicker">PRIMARY INCIDENT</span><h3>{incidentTitle}</h3><p>{incidentDescription}</p></div>
              <span className="severity-pill critical">{incidentSeverity.toUpperCase()}</span>
            </div>
            <div className="incident-facts">
              <div><span>Incident ID</span><strong>INC-{shipment.id.slice(-4)}-TEMP</strong></div>
              <div><span>Opened</span><strong>Oct 14, 03:18 UTC</strong></div>
              <div><span>{incidentIsTemperature ? "Peak reading" : "Delay duration"}</span><strong className="incident-danger">{incidentIsTemperature ? "9.4°C" : `${activeDemoShipment?.delay || 8} hours`}</strong></div>
              <div><span>{incidentIsTemperature ? "Safe threshold" : "Hold reason"}</span><strong>{incidentIsTemperature ? "8.0°C" : "Customs review"}</strong></div>
            </div>
          </div>

          <div className="incident-main-grid">
            <article className="incident-card route-evidence">
              <div className="incident-card-heading"><div><span className="command-card-kicker">SHIPMENT CONTEXT</span><h3>Route and sensor readings</h3></div><MapPinned size={17} /></div>
              <div className="incident-route-line"><span className="route-node origin">CNSHA</span><i /><span className="route-current"><Navigation size={13} /> 68%</span><i /><span className="route-node destination">NLRTM</span></div>
              <div className="incident-route-labels"><span>{shipment.originPort}</span><span>{shipment.destination}</span></div>
              <div className="incident-sensor-grid">
                <div><span>Current temperature</span><strong>{activeDemoShipment?.temperature || "4.3°C"}</strong><small className="sensor-good">Within range</small></div>
                <div><span>{incidentIsTemperature ? "Peak temperature" : "Shipment status"}</span><strong className={incidentIsTemperature ? "incident-danger" : ""}>{incidentIsTemperature ? "9.4°C" : shipment.status}</strong><small className={incidentIsTemperature ? "sensor-bad" : "sensor-warn"}>{incidentIsTemperature ? "+1.4°C over limit" : "Customs hold active"}</small></div>
                <div><span>Route progress</span><strong>{shipment.progress}%</strong><small className="sensor-warn">{Math.abs(progressDelta)} points behind plan</small></div>
                <div><span>Revised ETA</span><strong>Oct 23 · 02:00</strong><small className="sensor-warn">Medium risk</small></div>
              </div>
            </article>

            <article className="incident-card evidence-card">
              <div className="incident-card-heading"><div><span className="command-card-kicker">CHAIN OF EVIDENCE</span><h3>Chronological event evidence</h3></div><Fingerprint size={17} /></div>
              <div className="incident-evidence-list">
                {events.map((event, index) => (
                  <button key={event.hash} type="button" className={event.type === "TEMPERATURE_SPIKE" ? "incident-evidence active" : "incident-evidence"} onClick={() => { selectEvent(index); navigateToSection("timeline"); }}>
                    <span className={`evidence-marker ${event.tone}`}><span /></span>
                    <span><strong>{event.title}</strong><small>{event.date} · {event.location}</small></span>
                    {event.type === "TEMPERATURE_SPIKE" && <span className="evidence-flag">TRIGGER</span>}
                  </button>
                ))}
              </div>
            </article>
          </div>

          <div className="incident-lower-grid">
            <article className="incident-card expected-card">
              <div className="incident-card-heading"><div><span className="command-card-kicker">TIMELINE ANALYSIS</span><h3>Expected versus actual</h3></div><GitBranch size={17} /></div>
              <div className="timeline-comparison">
                <div className="timeline-comparison-head"><span>Milestone</span><span>Expected</span><span>Actual</span></div>
                <div><strong>{incidentIsTemperature ? "Temperature" : "Port release"}</strong><span>{incidentIsTemperature ? "≤ 8.0°C" : "Customs cleared"}</span><span className="comparison-bad">{incidentIsTemperature ? "9.4°C peak" : "Review pending"}</span></div>
                <div><strong>Route progress</strong><span>72% complete</span><span className="comparison-bad">{shipment.progress}% complete</span></div>
                <div><strong>Arrival estimate</strong><span>Oct 22 · 14:00</span><span className="comparison-bad">Oct 23 · 02:00</span></div>
                <div><strong>Custody status</strong><span>Continuous chain</span><span className="comparison-bad">Integrity review</span></div>
              </div>
            </article>

            <article className="incident-card notes-card">
              <div className="incident-card-heading"><div><span className="command-card-kicker">CASE MANAGEMENT</span><h3>Investigation notes</h3></div><Clipboard size={17} /></div>
              <textarea value={investigationNotes} onChange={event => setInvestigationNotes(event.target.value)} placeholder="Record findings, owner, and next steps..." aria-label="Investigation notes" />
              <div className="resolution-row">
                <label htmlFor="resolution-status">Resolution status</label>
                <select id="resolution-status" value={resolutionStatus} onChange={event => setResolutionStatus(event.target.value)}>
                  <option>Investigating</option><option>Mitigated</option><option>Resolved</option><option>Closed</option>
                </select>
              </div>
            </article>
          </div>
        </section>

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

        <section className="operations-overview" aria-label="Shipment operations overview">
          <div className="section-heading">
            <div>
              <div className="eyebrow">OPERATIONS OVERVIEW</div>
              <h2>Network health at a glance</h2>
            </div>
            <span className="sample-badge"><span /> Demo fleet · rule-based estimates</span>
          </div>
          <div className="operations-kpis">
            <article className="operation-kpi"><div className="kpi-icon blue"><Box size={17} /></div><span>Total containers</span><strong>48</strong><small>Across active routes</small></article>
            <article className="operation-kpi"><div className="kpi-icon cyan"><Navigation size={17} /></div><span>In transit</span><strong>12</strong><small>Currently travelling</small></article>
            <article className="operation-kpi"><div className="kpi-icon amber"><AlertTriangle size={17} /></div><span>Delayed shipments</span><strong>9</strong><small>Behind planned schedule</small></article>
            <article className="operation-kpi"><div className="kpi-icon green"><CheckCircle2 size={17} /></div><span>Delivered</span><strong>27</strong><small>Successfully completed</small></article>
            <article className="operation-kpi"><div className="kpi-icon red"><Thermometer size={17} /></div><span>Temperature alerts</span><strong>3</strong><small>Needs attention</small></article>
            <article className="operation-kpi"><div className="kpi-icon purple"><ShieldCheck size={17} /></div><span>Integrity status</span><strong>41<span>/48</span></strong><small>Verified · 5 pending · 2 failed</small></article>
          </div>
          <div className="overview-lower">
            <article className="activity-feed panel">
              <div className="panel-header compact-header">
                <div><div className="panel-title"><Activity size={16} /> Recent activity</div><p>Latest events across the demo fleet</p></div>
                <button type="button" className="text-button" onClick={() => navigateToSection("timeline")}>View timeline <ChevronRight size={14} /></button>
              </div>
              <div className="activity-list">
                {recentActivity.map(item => (
                  <button key={item.type} type="button" className="activity-item" onClick={() => {
                    if (item.type === "Temperature alert") reviewTemperatureEvent();
                    else navigateToSection("timeline");
                  }}>
                    <span className={`activity-dot ${item.tone}`} />
                    <span><strong>{item.type}</strong><small>{item.detail}</small></span>
                    <time>{item.time}</time>
                  </button>
                ))}
              </div>
            </article>
            <article className="risk-callout panel">
              <div className="risk-callout-icon"><AlertTriangle size={19} /></div>
              <div><span>RULE-BASED DEMO SIGNAL</span><strong>4 checkpoints behind schedule</strong><p>CONT-2026-0197 is trending toward a high delay risk based on route variance and customs hold.</p></div>
              <button type="button" onClick={() => chooseShipment("CONT-2026-0197")}>Review <ChevronRight size={14} /></button>
            </article>
          </div>
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
                <span><i className="legend-planned" /> Planned route</span>
                <span><i className="legend-current" /> Actual position</span>
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
                  <span>Actual route progress</span>
                  <strong>{shipment.progress}%</strong>
                </div>
                <div className="progress-track"><span style={{ width: `${shipment.progress}%` }} /></div>
                <div className="progress-labels planned-progress-label">
                  <span>Planned progress</span>
                  <strong>{shipment.plannedProgress}%</strong>
                </div>
                <div className="progress-track planned-track"><span style={{ width: `${shipment.plannedProgress}%` }} /></div>
                <div className={progressDelta < 0 ? "progress-delta behind" : "progress-delta"}>
                  {progressDelta < 0
                    ? `${Math.abs(progressDelta)} points behind plan`
                    : `${progressDelta} points ahead of plan`}
                </div>
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
                <div>
                  <small>ESTIMATED ARRIVAL</small>
                  <strong>{shipment.eta}</strong>
                  <span>Last update: {shipment.lastUpdate}</span>
                </div>
              </div>

              <div className={`delay-risk ${shipment.etaPrediction.risk.toLowerCase()}`}>
                <div className="delay-risk-heading">
                  <span><AlertTriangle size={14} /> DELAY-RISK INDICATOR</span>
                  <strong>{shipment.etaPrediction.risk} risk</strong>
                </div>
                <div className="delay-risk-eta">
                  <span>Rule-based revised ETA</span>
                  <strong>{shipment.etaPrediction.revisedEta}</strong>
                </div>
                <ul>
                  {shipment.etaPrediction.reasons.map(reason => <li key={reason}>{reason}</li>)}
                </ul>
                <small>{shipment.etaPrediction.rule}</small>
              </div>

              <button className="tracking-action" type="button" onClick={() => navigateToSection("timeline")}>
                <SearchCheck size={15} /> Inspect shipment events <ChevronRight size={15} />
              </button>
            </aside>
          </div>
        </section>

        <section className="replay-studio panel" id="replay">
          <div className="replay-header">
            <div>
              <div className="eyebrow">FORENSIC WORKSPACE · DEMO EVENT DATA</div>
              <h2><History size={20} /> Audit Trail Replay Studio</h2>
              <p>Replay exactly what happened to <strong>{shipment.id}</strong>, pause at a suspicious event, and inspect how it changed the reconstructed state.</p>
            </div>
            <div className="replay-header-actions">
              <span className="replay-status"><span /> {isReplayPlaying ? "REPLAYING" : "PAUSED"}</span>
              <button type="button" className="button button-secondary" onClick={resetReplay}><RotateCcw size={14} /> Reset replay</button>
            </div>
          </div>

          <div className="replay-toolbar">
            <div className="replay-controls">
              <button type="button" onClick={() => moveReplay(-1)} aria-label="Previous event"><SkipBack size={16} /></button>
              <button type="button" className="replay-play" onClick={() => {
                if (currentIndex >= events.length - 1) setSelectedEvent(0);
                setIsReplayPlaying(value => !value);
              }} aria-label={isReplayPlaying ? "Pause replay" : "Play replay"}>
                {isReplayPlaying ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button type="button" onClick={() => moveReplay(1)} aria-label="Next event"><SkipForward size={16} /></button>
            </div>
            <div className="replay-position">
              <span>REPLAYING EVENT</span>
              <strong>{String(currentIndex + 1).padStart(2, "0")} <small>/ {String(events.length).padStart(2, "0")}</small></strong>
            </div>
            <label className="replay-speed">Speed
              <select value={replaySpeed} onChange={e => setReplaySpeed(e.target.value)} aria-label="Replay speed">
                <option>0.5x</option><option>1x</option><option>2x</option>
              </select>
            </label>
            <div className="replay-mode" role="group" aria-label="Replay state mode">
              <button type="button" className={replayMode === "historical" ? "active" : ""} onClick={() => setReplayMode("historical")}><History size={13} /> Historical state</button>
              <button type="button" className={replayMode === "current" ? "active" : ""} onClick={() => setReplayMode("current")}><Target size={13} /> Current state</button>
            </div>
          </div>

          <div className="replay-rail" aria-label="Replay event sequence">
            <div className="replay-rail-line"><span style={{ width: `${events.length > 1 ? (currentIndex / (events.length - 1)) * 100 : 100}%` }} /></div>
            {events.map((event, index) => {
              const Icon = getEventIcon(event.type);
              return (
                <button key={event.hash} type="button" className={`replay-event ${index === currentIndex ? "active" : ""} ${index < currentIndex ? "visited" : ""}`} onClick={() => { setIsReplayPlaying(false); selectEvent(index); }} style={{ left: `${events.length > 1 ? (index / (events.length - 1)) * 100 : 0}%` }} aria-label={`Replay ${event.type}, event ${index + 1}`}>
                  <span className={`replay-event-icon ${event.tone}`}><Icon size={13} /></span>
                  <span className="replay-event-label"><strong>v{event.version}</strong><small>{event.type.replaceAll("_", " ")}</small></span>
                </button>
              );
            })}
          </div>

          <div className="replay-grid">
            <article className="replay-focus">
              <div className="replay-focus-heading">
                <div><span className={`replay-severity ${currentEvent.tone}`}>{currentEvent.tone === "red" ? "CRITICAL EVENT" : currentEvent.tone === "green" ? "SUCCESS EVENT" : "RECORDED EVENT"}</span><h3>{currentEvent.title}</h3><p>{currentEvent.date} · {currentEvent.location}</p></div>
                <strong className="replay-version">VERSION <b>#{String(currentEvent.version).padStart(3, "0")}</b></strong>
              </div>
              <div className="replay-focus-body">
                <div className="replay-state-card"><span>STATE AT THIS MOMENT</span><strong>{replayMode === "current" ? shipment.currentLocation : afterState.location}</strong><small>{replayMode === "current" ? shipment.status : afterState.status} · {replayMode === "current" ? "Latest reconstructed state" : "Historical reconstruction"}</small></div>
                <div className="replay-state-card"><span>SENSOR READING</span><strong>{replayMode === "current" ? "4.3°C" : afterState.temperature}</strong><small>{afterState.status === "Temperature alert" ? "Above safe threshold" : "Within expected range"}</small></div>
              </div>
              <p className="replay-detail">{currentEvent.detail}</p>
              <div className="replay-journey"><span>Origin</span><i /><strong>{currentEvent.location}</strong><i /><span>Destination</span></div>
            </article>

            <aside className="replay-integrity">
              <div className="replay-side-heading"><div><span>EVENT INTEGRITY SNAPSHOT</span><h3><Fingerprint size={16} /> Chain evidence</h3></div><span className={`replay-check-state ${integrityCheck.status}`}>{integrityCheck.status === "verified" ? "VERIFIED" : "PENDING"}</span></div>
              <div className="replay-hash-row"><span>Event hash</span><code>{currentEvent.hash}</code><button type="button" onClick={() => copyValue(currentEvent.hash, "Event hash")} aria-label="Copy event hash"><Clipboard size={13} /></button></div>
              <div className="replay-hash-row"><span>Previous hash</span><code>{previousEvent?.hash || "GENESIS EVENT"}</code>{previousEvent && <button type="button" onClick={() => copyValue(previousEvent.hash, "Previous hash")} aria-label="Copy previous hash"><Clipboard size={13} /></button>}</div>
              <div className="replay-chain-note"><LockKeyhole size={14} /><span>{previousEvent ? `v${currentEvent.version} follows v${previousEvent.version} in the sample event chain.` : "Genesis event · no previous hash exists."}</span></div>
              <button type="button" className="replay-verify" onClick={runIntegrityCheck}><ShieldCheck size={14} /> {integrityCheck.status === "verified" ? "Verify again" : "Run integrity check"}</button>
              <small className="replay-disclaimer">Demo UI result. Cryptographic verification and immutability must be provided by the backend.</small>
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

        <section className="shipment-table-panel panel" id="shipment-list">
          <div className="panel-header">
            <div><div className="panel-title"><Layers3 size={16} /> Shipment comparison</div><p>Compare route progress, ETA, sensor health, and verification status without leaving the dashboard.</p></div>
            <span className="sample-badge">Sample fleet</span>
          </div>
          <div className="table-toolbar">
            <div className="table-search"><Search size={14} /><input value={shipmentTableQuery} onChange={e => setShipmentTableQuery(e.target.value)} placeholder="Search container or route" aria-label="Search shipments" /></div>
            <select value={shipmentStatusFilter} onChange={e => setShipmentStatusFilter(e.target.value)} aria-label="Filter shipment status">
              <option>All</option><option>In Transit</option><option>Delayed</option><option>Delivered</option>
            </select>
            <select value={shipmentRiskFilter} onChange={e => setShipmentRiskFilter(e.target.value)} aria-label="Filter delay risk">
              <option>All</option><option>Low</option><option>Medium</option><option>High</option>
            </select>
            <select value={shipmentSort} onChange={e => setShipmentSort(e.target.value)} aria-label="Sort shipments">
              <option value="delay">Sort: delay</option><option value="eta">Sort: ETA</option><option value="progress">Sort: progress</option>
            </select>
            <button type="button" className="table-reset" onClick={() => { setShipmentTableQuery(""); setShipmentStatusFilter("All"); setShipmentRiskFilter("All"); setShipmentSort("delay"); }}><RotateCcw size={13} /> Clear</button>
          </div>
          <div className="shipment-table-wrap">
            <table className="shipment-table">
              <thead><tr><th>Container</th><th>Route</th><th>Status</th><th>Progress</th><th>ETA</th><th>Risk</th><th>Temperature</th><th>Integrity</th><th>Last update</th><th>Action</th></tr></thead>
              <tbody>
                {filteredShipmentRows.map(row => (
                  <tr key={row.id}>
                    <td><button type="button" className="table-link" onClick={() => shipments[row.id] ? chooseShipment(row.id) : setNotice(`${row.id} is a demo comparison record; detailed history is not loaded.`)}>{row.id}</button></td>
                    <td>{row.route}</td>
                    <td><span className={`table-status ${row.status.toLowerCase().replace(" ", "-")}`}><i />{row.status}</span></td>
                    <td><div className="table-progress"><span><i style={{ width: `${row.progress}%` }} /></span><strong>{row.progress}%</strong></div></td>
                    <td>{row.eta}</td>
                    <td><span className={`risk-pill ${row.risk.toLowerCase()}`}>{row.risk}</span></td>
                    <td className={row.temperature === "5.1°C" ? "temperature-warning" : ""}>{row.temperature}</td>
                    <td><span className={`integrity-pill ${row.integrity.toLowerCase()}`}>{row.integrity}</span></td>
                    <td>{row.lastUpdate}</td>
                    <td><button type="button" className="table-action" onClick={() => { if (shipments[row.id]) { chooseShipment(row.id); navigateToSection("timeline"); } else setNotice(`${row.id} is a demo comparison record; detailed history is not loaded.`); }}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredShipmentRows.length && <div className="table-empty">No shipments match the current filters.</div>}
          </div>
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
            <div className="timeline-filters">
              <div className="timeline-search"><Search size={13} /><input value={timelineQuery} onChange={e => setTimelineQuery(e.target.value)} placeholder="Search events, locations, payloads" aria-label="Search event timeline" /></div>
              <select value={timelineSeverity} onChange={e => setTimelineSeverity(e.target.value)} aria-label="Filter event severity">
                <option>All</option><option>Critical</option><option>Warning</option><option>Success</option><option>Info</option>
              </select>
              <span><FileText size={12} /> {filteredEvents.length} shown</span>
            </div>

            {activeTab === "Timeline" ? (
              <div className="timeline-list">
                {(showAllEvents ? filteredEvents : filteredEvents.slice(-3)).map(event => {
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
                      aria-pressed={currentIndex === index}
                      type="button"
                    >
                      <div className="event-marker">
                        <div className={`event-icon ${event.tone}`}>
                          <Icon size={17} />
                        </div>
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
                        <div className="event-id">
                          EVENT ID <code>{getEventId(shipment.id, event)}</code>
                        </div>
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

              <div className="selected-event-detail">
                <div className="selected-event-heading">
                  <span>SELECTED EVENT</span>
                  <span className={`detail-status ${currentEvent.tone}`}>
                    {currentEvent.type.replaceAll("_", " ")}
                  </span>
                </div>
                <strong>{currentEvent.title}</strong>
                <p>{currentEvent.detail}</p>
                <div className="inspector-actions">
                  <button type="button" onClick={() => copyValue(getEventId(shipment.id, currentEvent), "Event ID")}><Clipboard size={12} /> Copy event ID</button>
                  <button type="button" onClick={() => copyValue(currentEvent.hash, "Event hash")}><Fingerprint size={12} /> Copy hash</button>
                </div>
                <details className="payload-details">
                  <summary>View event payload <ChevronDown size={13} /></summary>
                  <pre>{JSON.stringify({ type: currentEvent.type, version: currentEvent.version, location: currentEvent.location, recordedAt: currentEvent.date, severity: currentEvent.tone === "red" ? "critical" : "normal" }, null, 2)}</pre>
                </details>
                <div className="event-detail-grid">
                  <div>
                    <span>Event ID</span>
                    <code>{getEventId(shipment.id, currentEvent)}</code>
                  </div>
                  <div>
                    <span>Previous state</span>
                    <strong>{getPreviousState(events, currentIndex)}</strong>
                  </div>
                </div>
              </div>

              <div className="state-comparison">
                <div className="comparison-heading">
                  <div>
                    <span>BEFORE-AND-AFTER COMPARISON</span>
                    <strong>State change at this event</strong>
                  </div>
                  <span className="comparison-count">
                    {changedStateComparisons.length} changed
                  </span>
                </div>
                <div className="comparison-table">
                  <div className="comparison-table-header">
                    <span>Field</span>
                    <span>Before</span>
                    <span>After</span>
                  </div>
                  {stateComparisons.map(comparison => {
                    const changed = comparison.before !== comparison.after;
                    return (
                      <div
                        className={changed ? "comparison-row changed" : "comparison-row"}
                        key={comparison.label}
                      >
                        <strong>{comparison.label}</strong>
                        <span>{comparison.before}</span>
                        <span className="comparison-after">
                          {comparison.after}
                          {changed && <ArrowUpRight size={12} />}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="comparison-note">
                  {changedStateComparisons.length
                    ? "Changed fields are highlighted for the selected event."
                    : "No tracked state fields changed at this event."}
                </p>
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

        <section className="analytics-page panel" id="analytics">
          <div className="analytics-header">
            <div>
              <div className="eyebrow">OPERATIONS INTELLIGENCE</div>
              <h2>Smart analytics &amp; reports</h2>
              <p>Track shipment volume, delivery reliability, and operational trends across your logistics network.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={exportAnalyticsCsv}>
              <Download size={15} /> Download CSV report
            </button>
          </div>

          <div className="analytics-kpis">
            <article className="analytics-kpi">
              <span>Total shipments</span>
              <strong>{totalShipments}</strong>
              <small><ArrowUpRight size={12} /> 14.6% vs last month</small>
            </article>
            <article className="analytics-kpi">
              <span>On-time delivery</span>
              <strong>83.2%</strong>
              <small><ArrowUpRight size={12} /> 3.8% improvement</small>
            </article>
            <article className="analytics-kpi">
              <span>Average delivery time</span>
              <strong>6.8 <em>days</em></strong>
              <small>Across completed shipments</small>
            </article>
            <article className="analytics-kpi">
              <span>Delayed shipments</span>
              <strong className="warning-number">33</strong>
              <small>16.8% of total volume</small>
            </article>
          </div>

          <div className="analytics-charts">
            <article className="analytics-card trend-card">
              <div className="analytics-card-header">
                <div>
                  <h3>Monthly shipment trends</h3>
                  <p>Volume and delivery performance over the last six months</p>
                </div>
                <span className="analytics-period">MAY–OCT 2026</span>
              </div>
              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyShipmentTrends} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="#22344a" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#8094ac", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8094ac", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#101925", border: "1px solid #29415b", borderRadius: 6, color: "#edf5ff" }}
                      labelStyle={{ color: "#91a3bb" }}
                    />
                    <Bar dataKey="onTime" name="On time" stackId="delivery" fill="#45d6ce" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="delayed" name="Delayed" stackId="delivery" fill="#d98b48" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="analytics-legend"><span><i className="legend-on-time" /> On time</span><span><i className="legend-delayed" /> Delayed</span></div>
            </article>

            <article className="analytics-card status-card">
              <div className="analytics-card-header">
                <div>
                  <h3>Shipments by status</h3>
                  <p>Current operational distribution</p>
                </div>
                <Package size={18} />
              </div>
              <div className="analytics-chart status-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shipmentStatusTotals} layout="vertical" margin={{ top: 4, right: 14, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#22344a" strokeDasharray="3 5" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="status" type="category" width={82} tick={{ fill: "#8094ac", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "#183047" }}
                      contentStyle={{ background: "#101925", border: "1px solid #29415b", borderRadius: 6, color: "#edf5ff" }}
                    />
                    <Bar dataKey="shipments" name="Shipments" fill="#238bd7" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <div className="analytics-summary">
            <div><span>Delivery split</span><strong>164 on time <em>/</em> 33 delayed</strong></div>
            <div><span>Reporting period</span><strong>May 1 – Oct 20, 2026</strong></div>
            <div><span>Data freshness</span><strong><span className="fresh-dot" /> Updated 4 min ago</strong></div>
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

            <div className="chain-explorer">
              <div className="chain-explorer-header">
                <div>
                  <span>EVENT CHAIN VERIFICATION EXPLORER</span>
                  <strong>Hash links from genesis to latest</strong>
                </div>
                <span className={`chain-state ${chainVerification.status}`}>
                  <span />
                  {chainVerification.status === "verified" ? "CHAIN VERIFIED" : chainVerification.status === "failed" ? "VERIFICATION FAILED" : "NOT VERIFIED"}
                </span>
              </div>
              <div className="chain-list">
                {chainRows.map(({ event, index, previousHash, currentHash }) => {
                  const isFailure = chainVerification.failedIndex === index;
                  return (
                    <div key={event.hash} className={`chain-row ${isFailure ? "failed" : ""}`}>
                      <div className={`chain-node ${event.tone}`}><span>{event.version}</span></div>
                      <div className="chain-event-copy">
                        <strong>{event.title}</strong>
                        <small>{getEventId(shipment.id, event)}</small>
                      </div>
                      <div className="chain-hash-pair">
                        <div><span>PREVIOUS HASH</span><code>{previousHash}</code></div>
                        <ArrowUpRight size={13} />
                        <div><span>CURRENT HASH</span><code>{currentHash}</code></div>
                      </div>
                      {isFailure && <span className="chain-failure-label"><CircleAlert size={12} /> Failure here</span>}
                    </div>
                  );
                })}
              </div>
              {chainVerification.status === "failed" && (
                <div className="chain-failure-banner">
                  <CircleAlert size={15} />
                  <span>Verification stopped at <strong>v{chainVerification.failedIndex + 1}</strong>. The current hash no longer matches the link expected by the next event.</span>
                </div>
              )}
              <div className="chain-actions">
                <button type="button" onClick={() => verifyEventChain()}><ShieldCheck size={14} /> Verify full chain</button>
                <button type="button" className={chainVerification.tampered ? "active" : ""} onClick={toggleTamperSimulation}><AlertTriangle size={14} /> {chainVerification.tampered ? "Restore original chain" : "Simulate tampered event"}</button>
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

      {isCommandOpen && (
        <div
          className="command-overlay"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setIsCommandOpen(false);
          }}
        >
          <section className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title">
            <div className="command-search">
              <Search size={18} />
              <input
                ref={commandInputRef}
                value={commandQuery}
                onChange={event => {
                  setCommandQuery(event.target.value);
                  setActiveCommand(0);
                }}
                onKeyDown={handleCommandKeyDown}
                placeholder="Search commands..."
                aria-label="Search commands"
              />
              <kbd>ESC</kbd>
            </div>
            <div className="command-heading">
              <span id="command-title">QUICK ACTIONS</span>
              <small>Navigate your workspace</small>
            </div>
            <div className="command-list">
              {filteredCommands.length ? filteredCommands.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className={activeCommand === index ? "command-item active" : "command-item"}
                    type="button"
                    onMouseEnter={() => setActiveCommand(index)}
                    onClick={action.run}
                  >
                    <span className="command-icon"><Icon size={17} /></span>
                    <span className="command-copy">
                      <strong>{action.label}</strong>
                      <small>{action.description}</small>
                    </span>
                    <kbd>{action.shortcut}</kbd>
                  </button>
                );
              }) : (
                <div className="command-empty">No matching shortcuts found.</div>
              )}
            </div>
            <div className="command-footer">
              <span><Command size={13} /> Quick search</span>
              <span><kbd>↑↓</kbd> Select <kbd>↵</kbd> Open</span>
            </div>
          </section>
        </div>
      )}

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
