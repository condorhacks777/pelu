import { useState, useMemo } from "react";
import {
  Scissors, Clock, Calendar, CheckCircle, Lock, LayoutDashboard,
  User, Phone, ChevronRight, ChevronLeft, Star, Sparkles,
  TrendingUp, Users, X, ArrowLeft, LogOut, Shield
} from "lucide-react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "corte",   name: "Corte",   duration: 30,  price: 35,  icon: "✂️", desc: "Corte personalizado con acabado profesional" },
  { id: "alisado", name: "Alisado", duration: 120, price: 95,  icon: "💫", desc: "Alisado permanente con productos premium" },
  { id: "mechas",  name: "Mechas",  duration: 180, price: 130, icon: "✨", desc: "Mechas y coloración de alta gama" },
  { id: "peinado", name: "Peinado", duration: 45,  price: 55,  icon: "🪄", desc: "Peinado de evento y estilismo" },
];

const SLOT_START = 9 * 60; // 09:00 in minutes
const SLOT_END   = 19 * 60; // 19:00
const SLOT_STEP  = 30;

const ADMIN_PIN = "1234";

const PALETTE = {
  cream:    "#FAF7F2",
  warm:     "#F0EAE0",
  sand:     "#D4C5B0",
  rose:     "#C9A89A",
  roseDeep: "#A67262",
  charcoal: "#2C2825",
  muted:    "#8C8078",
  white:    "#FFFFFF",
};

const DEMO_APPOINTMENTS = [
  { id: "d1", clientName: "Isabella Moreno", phone: "612 345 678", serviceId: "mechas",  date: todayStr(), startMin: 9*60,   confirmed: true },
  { id: "d2", clientName: "Carmen Vidal",    phone: "623 456 789", serviceId: "corte",   date: todayStr(), startMin: 11*60,  confirmed: true },
  { id: "d3", clientName: "Lucía Ferrer",    phone: "634 567 890", serviceId: "peinado", date: todayStr(), startMin: 12*60,  confirmed: true },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function minToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, "0");
  const min = (m % 60).toString().padStart(2, "0");
  return `${h}:${min}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}

// ─── SHARED STATE HOOK ────────────────────────────────────────────────────────

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Btn({ children, onClick, variant = "primary", className = "", disabled }) {
  const base = "px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";
  const variants = {
    primary: `text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40`,
    ghost:   `bg-transparent border hover:bg-black/5`,
    outline: `border bg-white hover:bg-[${PALETTE.cream}] shadow-sm`,
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={variant === "primary" ? { background: `linear-gradient(135deg, ${PALETTE.rose}, ${PALETTE.roseDeep})`, borderColor: "transparent" } :
             variant === "ghost"   ? { borderColor: PALETTE.sand, color: PALETTE.muted } :
                                     { borderColor: PALETTE.sand, color: PALETTE.charcoal }}
    >
      {children}
    </button>
  );
}

// ── MODE SWITCHER ─────────────────────────────────────────────────────────────

function ModeSwitcher({ mode, setMode }) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl" style={{ background: PALETTE.warm }}>
      {[
        { id: "client", label: "Reservar Cita", icon: <User size={14}/> },
        { id: "admin",  label: "Panel Admin",   icon: <Shield size={14}/> },
      ].map(({ id, label, icon }) => (
        <button key={id} onClick={() => setMode(id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: mode === id ? PALETTE.white : "transparent",
            color: mode === id ? PALETTE.charcoal : PALETTE.muted,
            boxShadow: mode === id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          }}>
          {icon}{label}
        </button>
      ))}
    </div>
  );
}

// ── CLIENT FLOW ───────────────────────────────────────────────────────────────

function ClientStep({ step, total, label }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
          style={{ background: i < step ? PALETTE.rose : PALETTE.sand }} />
      ))}
      <span className="text-xs whitespace-nowrap" style={{ color: PALETTE.muted }}>{step}/{total} · {label}</span>
    </div>
  );
}

function StepLogin({ onNext }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const inputStyle = {
    background: PALETTE.white,
    border: `1.5px solid ${PALETTE.sand}`,
    borderRadius: "1rem",
    padding: "0.875rem 1.125rem",
    fontSize: "0.9375rem",
    color: PALETTE.charcoal,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div>
      <ClientStep step={1} total={4} label="Bienvenida" />
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center text-3xl shadow-lg"
          style={{ background: `linear-gradient(135deg, ${PALETTE.warm}, ${PALETTE.sand})` }}>
          ✂️
        </div>
        <h2 className="text-3xl mb-2" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>
          Bienvenida
        </h2>
        <p style={{ color: PALETTE.muted, fontSize: "0.9rem" }}>Reserva tu cita en segundos</p>
      </div>
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: PALETTE.muted }}>Tu nombre</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: PALETTE.sand }} />
            <input style={{ ...inputStyle, paddingLeft: "2.75rem" }} placeholder="Ej: Ana García"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: PALETTE.muted }}>Teléfono</label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: PALETTE.sand }} />
            <input style={{ ...inputStyle, paddingLeft: "2.75rem" }} placeholder="612 345 678" type="tel"
              value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
      </div>
      <Btn onClick={() => onNext({ name, phone })} disabled={!name.trim() || !phone.trim()} className="w-full">
        Continuar <ChevronRight size={16} />
      </Btn>
    </div>
  );
}

function StepService({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <ClientStep step={2} total={4} label="Servicio" />
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: PALETTE.muted }}>
        <ArrowLeft size={15} /> Volver
      </button>
      <h2 className="text-2xl mb-1" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>¿Qué servicio deseas?</h2>
      <p className="text-sm mb-7" style={{ color: PALETTE.muted }}>Selecciona uno para continuar</p>
      <div className="space-y-3 mb-8">
        {SERVICES.map(svc => (
          <button key={svc.id} onClick={() => setSelected(svc.id)}
            className="w-full text-left rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: selected === svc.id ? `linear-gradient(135deg, ${PALETTE.rose}18, ${PALETTE.roseDeep}10)` : PALETTE.white,
              border: `2px solid ${selected === svc.id ? PALETTE.rose : PALETTE.sand}`,
              boxShadow: selected === svc.id ? `0 4px 20px ${PALETTE.rose}30` : "0 1px 4px rgba(0,0,0,0.04)",
            }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{svc.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold" style={{ color: PALETTE.charcoal, fontFamily: "Georgia, serif" }}>{svc.name}</p>
                  <p className="font-bold" style={{ color: PALETTE.roseDeep }}>{svc.price}€</p>
                </div>
                <p className="text-xs mt-0.5" style={{ color: PALETTE.muted }}>{svc.desc}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock size={11} style={{ color: PALETTE.sand }} />
                  <span className="text-xs" style={{ color: PALETTE.muted }}>{svc.duration} min</span>
                </div>
              </div>
              {selected === svc.id && <CheckCircle size={18} style={{ color: PALETTE.rose }} />}
            </div>
          </button>
        ))}
      </div>
      <Btn onClick={() => onNext(selected)} disabled={!selected} className="w-full">
        Elegir fecha y hora <ChevronRight size={16} />
      </Btn>
    </div>
  );
}

function StepDateTime({ serviceId, appointments, onNext, onBack }) {
  const svc = SERVICES.find(s => s.id === serviceId);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  }, []);

  const slots = useMemo(() => {
    const dayAppts = appointments.filter(a => a.date === selectedDate);
    const result = [];
    for (let t = SLOT_START; t + svc.duration <= SLOT_END; t += SLOT_STEP) {
      const end = t + svc.duration;
      const blocked = dayAppts.some(a => {
        const as = SERVICES.find(s => s.id === a.serviceId);
        const aEnd = a.startMin + as.duration;
        return t < aEnd && end > a.startMin;
      });
      result.push({ startMin: t, blocked });
    }
    return result;
  }, [selectedDate, appointments, svc]);

  const dayLabel = (d) => {
    const dt = new Date(d + "T12:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    const diff = Math.round((dt - today) / 86400000);
    if (diff === 0) return "Hoy";
    if (diff === 1) return "Mañana";
    return dt.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" });
  };

  return (
    <div>
      <ClientStep step={3} total={4} label="Fecha y hora" />
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: PALETTE.muted }}>
        <ArrowLeft size={15} /> Volver
      </button>
      <h2 className="text-2xl mb-1" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>Elige tu momento</h2>
      <div className="flex items-center gap-2 mb-6 text-sm px-3 py-2 rounded-xl w-fit" style={{ background: PALETTE.warm }}>
        <Clock size={14} style={{ color: PALETTE.rose }} />
        <span style={{ color: PALETTE.charcoal }}><strong>{svc.name}</strong> · {svc.duration} min</span>
      </div>

      {/* Date picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {days.map(d => (
          <button key={d} onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
            className="flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200"
            style={{
              background: selectedDate === d ? `linear-gradient(135deg, ${PALETTE.rose}, ${PALETTE.roseDeep})` : PALETTE.white,
              color: selectedDate === d ? PALETTE.white : PALETTE.charcoal,
              border: `1.5px solid ${selectedDate === d ? "transparent" : PALETTE.sand}`,
              minWidth: "64px",
            }}>
            {dayLabel(d)}
          </button>
        ))}
      </div>

      {/* Time slots */}
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PALETTE.muted }}>Horas disponibles</p>
      <div className="grid grid-cols-4 gap-2 mb-8">
        {slots.map(({ startMin, blocked }) => (
          <button key={startMin} disabled={blocked}
            onClick={() => setSelectedSlot(startMin)}
            className="py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              background: blocked ? PALETTE.warm : selectedSlot === startMin ? `linear-gradient(135deg, ${PALETTE.rose}, ${PALETTE.roseDeep})` : PALETTE.white,
              color: blocked ? PALETTE.sand : selectedSlot === startMin ? PALETTE.white : PALETTE.charcoal,
              border: `1.5px solid ${blocked ? "transparent" : selectedSlot === startMin ? "transparent" : PALETTE.sand}`,
              opacity: blocked ? 0.5 : 1,
              textDecoration: blocked ? "line-through" : "none",
              cursor: blocked ? "not-allowed" : "pointer",
            }}>
            {minToTime(startMin)}
          </button>
        ))}
      </div>
      <Btn onClick={() => onNext({ date: selectedDate, startMin: selectedSlot })} disabled={selectedSlot === null} className="w-full">
        Ver resumen <ChevronRight size={16} />
      </Btn>
    </div>
  );
}

function StepConfirmation({ booking, onConfirm, onBack }) {
  const svc = SERVICES.find(s => s.id === booking.serviceId);

  return (
    <div>
      <ClientStep step={4} total={4} label="Confirmar" />
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: PALETTE.muted }}>
        <ArrowLeft size={15} /> Volver
      </button>
      <h2 className="text-2xl mb-6" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>Resumen de tu cita</h2>

      {/* Premium card */}
      <div className="rounded-3xl overflow-hidden mb-8 shadow-xl"
        style={{ background: `linear-gradient(160deg, ${PALETTE.charcoal} 0%, #3d3028 100%)` }}>
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              {svc.icon}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: PALETTE.sand }}>Atelier de Belleza</p>
              <p className="text-white font-semibold" style={{ fontFamily: "Georgia, serif" }}>Reserva Premium</p>
            </div>
            <Sparkles size={20} className="ml-auto" style={{ color: PALETTE.rose }} />
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { label: "Cliente",   value: booking.clientName, icon: <User size={14}/> },
            { label: "Servicio",  value: svc.name, icon: <Scissors size={14}/> },
            { label: "Fecha",     value: formatDate(booking.date), icon: <Calendar size={14}/> },
            { label: "Hora",      value: `${minToTime(booking.startMin)} — ${minToTime(booking.startMin + svc.duration)}`, icon: <Clock size={14}/> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.08)", color: PALETTE.sand }}>
                {icon}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: PALETTE.sand }}>{label}</p>
                <p className="text-white text-sm font-medium mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: "rgba(0,0,0,0.2)" }}>
          <span className="text-sm" style={{ color: PALETTE.sand }}>Total estimado</span>
          <span className="text-2xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>{svc.price}€</span>
        </div>
      </div>

      <Btn onClick={onConfirm} className="w-full text-base py-4">
        <CheckCircle size={18} /> Confirmar Reserva
      </Btn>
    </div>
  );
}

function StepSuccess({ booking, onReset }) {
  const svc = SERVICES.find(s => s.id === booking.serviceId);
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg animate-bounce"
        style={{ background: `linear-gradient(135deg, ${PALETTE.rose}30, ${PALETTE.roseDeep}20)`, border: `2px solid ${PALETTE.rose}` }}>
        ✨
      </div>
      <h2 className="text-3xl mb-3" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>¡Todo listo!</h2>
      <p className="text-sm mb-2" style={{ color: PALETTE.muted }}>Tu cita ha sido confirmada</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
        style={{ background: PALETTE.warm, color: PALETTE.roseDeep }}>
        <Clock size={14} /> {formatDate(booking.date)} · {minToTime(booking.startMin)}
      </div>
      <div className="rounded-2xl p-4 mb-8 text-left" style={{ background: PALETTE.warm }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PALETTE.muted }}>Detalles</p>
        <div className="flex justify-between items-center">
          <span style={{ color: PALETTE.charcoal }}>{svc.name}</span>
          <span className="font-bold" style={{ color: PALETTE.roseDeep }}>{svc.price}€</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm" style={{ color: PALETTE.muted }}>Duración</span>
          <span className="text-sm" style={{ color: PALETTE.muted }}>{svc.duration} min</span>
        </div>
      </div>
      <Btn onClick={onReset} variant="outline" className="w-full">
        Hacer otra reserva
      </Btn>
    </div>
  );
}

function ClientView({ appointments, onNewAppointment }) {
  const [step, setStep] = useState("login");
  const [booking, setBooking] = useState({});

  const handleLogin = ({ name, phone }) => {
    setBooking(b => ({ ...b, clientName: name, phone }));
    setStep("service");
  };
  const handleService = (serviceId) => {
    setBooking(b => ({ ...b, serviceId }));
    setStep("datetime");
  };
  const handleDateTime = ({ date, startMin }) => {
    setBooking(b => ({ ...b, date, startMin }));
    setStep("confirm");
  };
  const handleConfirm = () => {
    onNewAppointment({ ...booking, id: Date.now().toString(), confirmed: true });
    setStep("success");
  };
  const handleReset = () => {
    setBooking({});
    setStep("login");
  };

  return (
    <div>
      {step === "login"    && <StepLogin onNext={handleLogin} />}
      {step === "service"  && <StepService onNext={handleService} onBack={() => setStep("login")} />}
      {step === "datetime" && <StepDateTime serviceId={booking.serviceId} appointments={appointments} onNext={handleDateTime} onBack={() => setStep("service")} />}
      {step === "confirm"  && <StepConfirmation booking={booking} onConfirm={handleConfirm} onBack={() => setStep("datetime")} />}
      {step === "success"  && <StepSuccess booking={booking} onReset={handleReset} />}
    </div>
  );
}

// ── ADMIN VIEW ────────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === ADMIN_PIN) { setTimeout(() => onLogin(), 200); }
      else { setTimeout(() => { setPin(""); setError(true); setTimeout(() => setError(false), 1500); }, 400); }
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg"
        style={{ background: `linear-gradient(135deg, ${PALETTE.charcoal}, #4a3f35)` }}>
        <Lock size={24} style={{ color: PALETTE.rose }} />
      </div>
      <h2 className="text-2xl mb-1" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>Acceso Admin</h2>
      <p className="text-sm mb-8" style={{ color: PALETTE.muted }}>Introduce tu PIN de 4 dígitos</p>

      {/* PIN display */}
      <div className="flex justify-center gap-4 mb-8">
        {[0,1,2,3].map(i => (
          <div key={i} className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200"
            style={{
              background: error ? "#fee2e2" : pin.length > i ? PALETTE.charcoal : PALETTE.warm,
              border: `2px solid ${error ? "#fca5a5" : pin.length > i ? PALETTE.charcoal : PALETTE.sand}`,
            }}>
            {pin.length > i ? <span style={{ color: error ? "#ef4444" : PALETTE.rose }}>●</span> : ""}
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-red-400 mb-4 font-medium">PIN incorrecto. Inténtalo de nuevo.</p>}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d, i) => (
          <button key={i}
            onClick={() => d === "⌫" ? setPin(p => p.slice(0,-1)) : d !== "" ? handleDigit(String(d)) : null}
            disabled={d === ""}
            className="h-14 rounded-2xl text-lg font-semibold transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-0"
            style={{ background: d === "⌫" ? PALETTE.warm : PALETTE.white, color: PALETTE.charcoal, border: `1.5px solid ${PALETTE.sand}` }}>
            {d}
          </button>
        ))}
      </div>
      <p className="text-xs mt-6" style={{ color: PALETTE.sand }}>Demo PIN: 1234</p>
    </div>
  );
}

function ConfirmDeleteModal({ appt, onConfirm, onCancel }) {
  const svc = SERVICES.find(s => s.id === appt.serviceId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: "rgba(44,40,37,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{ background: PALETTE.white, border: `1px solid ${PALETTE.warm}` }}>
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "#FEE2E2" }}>
          <X size={22} style={{ color: "#EF4444" }} />
        </div>
        <h3 className="text-lg text-center mb-1" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>
          ¿Cancelar esta cita?
        </h3>
        <p className="text-sm text-center mb-5" style={{ color: PALETTE.muted }}>Esta acción no se puede deshacer.</p>
        <div className="rounded-2xl p-4 mb-6" style={{ background: PALETTE.cream }}>
          <p className="font-semibold text-sm" style={{ color: PALETTE.charcoal }}>{appt.clientName}</p>
          <p className="text-xs mt-0.5" style={{ color: PALETTE.muted }}>
            {svc.icon} {svc.name} · {minToTime(appt.startMin)} – {minToTime(appt.startMin + svc.duration)}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: PALETTE.warm, color: PALETTE.muted }}>
            Volver
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f87171, #ef4444)" }}>
            Sí, cancelar cita
          </button>
        </div>
      </div>
    </div>
  );
}

function TimeBar({ appt, onDelete }) {
  const svc = SERVICES.find(s => s.id === appt.serviceId);
  const totalMinutes = SLOT_END - SLOT_START;
  const leftPct  = ((appt.startMin - SLOT_START) / totalMinutes) * 100;
  const widthPct = (svc.duration / totalMinutes) * 100;
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      {confirming && (
        <ConfirmDeleteModal
          appt={appt}
          onConfirm={() => { setConfirming(false); onDelete(appt.id); }}
          onCancel={() => setConfirming(false)}
        />
      )}
      <div className="rounded-2xl p-4 mb-3 transition-all duration-200"
        style={{ background: PALETTE.white, border: `1px solid ${PALETTE.warm}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{svc.icon}</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: PALETTE.charcoal, fontFamily: "Georgia, serif" }}>{appt.clientName}</p>
              <p className="text-xs" style={{ color: PALETTE.muted }}>{svc.name} · {appt.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: PALETTE.roseDeep }}>{svc.price}€</p>
              <p className="text-xs" style={{ color: PALETTE.muted }}>{svc.duration} min</p>
            </div>
            <button
              onClick={() => setConfirming(true)}
              title="Cancelar cita"
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95"
              style={{ background: "#FEE2E2", color: "#EF4444" }}>
              <X size={15} />
            </button>
          </div>
        </div>
        {/* Micro timeline */}
        <div className="relative h-6 rounded-xl overflow-hidden" style={{ background: PALETTE.warm }}>
          <div className="absolute top-0 h-full rounded-xl flex items-center px-2"
            style={{
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              background: `linear-gradient(90deg, ${PALETTE.rose}, ${PALETTE.roseDeep})`,
            }}>
            <p className="text-white text-xs font-medium truncate">
              {minToTime(appt.startMin)} – {minToTime(appt.startMin + svc.duration)}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs" style={{ color: PALETTE.sand }}>09:00</span>
          <span className="text-xs" style={{ color: PALETTE.sand }}>19:00</span>
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ appointments, onLogout, onDelete }) {
  const todayAppts = appointments.filter(a => a.date === todayStr())
    .sort((a, b) => a.startMin - b.startMin);
  const totalRevenue = todayAppts.reduce((acc, a) => {
    const svc = SERVICES.find(s => s.id === a.serviceId);
    return acc + svc.price;
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: PALETTE.charcoal }}>Panel del Día</h2>
          <p className="text-sm capitalize" style={{ color: PALETTE.muted }}>{formatDate(todayStr())}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl hover:opacity-70 transition-opacity"
          style={{ background: PALETTE.warm, color: PALETTE.muted }}>
          <LogOut size={13} /> Salir
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Citas hoy", value: todayAppts.length, icon: <Users size={18} />, accent: PALETTE.rose },
          { label: "Facturación", value: `${totalRevenue}€`, icon: <TrendingUp size={18} />, accent: PALETTE.roseDeep },
        ].map(({ label, value, icon, accent }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: PALETTE.white, border: `1px solid ${PALETTE.warm}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${accent}18`, color: accent }}>{icon}</div>
            <p className="text-2xl font-bold" style={{ color: PALETTE.charcoal, fontFamily: "Georgia, serif" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: PALETTE.muted }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Agenda */}
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: PALETTE.muted }}>Agenda de hoy</p>
      {todayAppts.length === 0 ? (
        <div className="text-center py-10" style={{ color: PALETTE.sand }}>
          <Calendar size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Sin citas para hoy</p>
        </div>
      ) : (
        todayAppts.map(a => <TimeBar key={a.id} appt={a} onDelete={onDelete} />)
      )}
    </div>
  );
}

function AdminView({ appointments, onDelete }) {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <AdminDashboard appointments={appointments} onLogout={() => setLoggedIn(false)} onDelete={onDelete} />
    : <AdminLogin onLogin={() => setLoggedIn(true)} />;
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState("client");
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS);

  const addAppointment    = (appt) => setAppointments(prev => [...prev, appt]);
  const deleteAppointment = (id)   => setAppointments(prev => prev.filter(a => a.id !== id));

  return (
    <div className="min-h-screen" style={{ background: PALETTE.cream, fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}>
      <div className="max-w-md mx-auto px-5 py-6 min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${PALETTE.rose}, ${PALETTE.roseDeep})` }}>
              <Scissors size={16} color={PALETTE.white} />
            </div>
            <div>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: PALETTE.charcoal, lineHeight: 1.1 }}>Atelier Belleza</h1>
              <p style={{ fontSize: "0.65rem", color: PALETTE.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Estudio Profesional</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: PALETTE.warm, color: PALETTE.muted }}>
            <Star size={11} style={{ color: PALETTE.rose }} fill={PALETTE.rose} />
            Premium
          </div>
        </header>

        {/* Mode switcher */}
        <div className="mb-6">
          <ModeSwitcher mode={mode} setMode={setMode} />
        </div>

        {/* Content card */}
        <div className="flex-1 rounded-3xl p-6 shadow-lg"
          style={{ background: PALETTE.white, border: `1px solid ${PALETTE.warm}` }}>
          {mode === "client"
            ? <ClientView appointments={appointments} onNewAppointment={addAppointment} />
            : <AdminView appointments={appointments} onDelete={deleteAppointment} />}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-5" style={{ color: PALETTE.sand }}>
          © 2026 Atelier Belleza · Gestión Profesional
        </p>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input::placeholder { color: #C4B8AC; }
        select { color: #2C2825; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce { animation: bounce 1.2s ease-in-out 3; }
      `}</style>
    </div>
  );
}
