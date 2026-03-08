/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clipboard, 
  Plus, 
  Trash2, 
  Radio, 
  Bike, 
  Car, 
  Users, 
  Calendar,
  ChevronRight,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface PersonnelCount {
  of: number;
  sub: number;
  pt: number;
  aux: number;
}

interface Novelty {
  id: string;
  count: PersonnelCount;
  description: string;
  names: string;
}

interface RadioItem {
  id: string;
  name: string;
}

interface VehicleItem {
  id: string;
  sigla: string;
  status: string;
}

// --- Constants ---

const INITIAL_NOVELTIES: Novelty[] = [
  { id: '1', count: { of: 0, sub: 2, pt: 3, aux: 1 }, description: 'Servicios', names: '' },
  { id: '2', count: { of: 0, sub: 1, pt: 1, aux: 0 }, description: 'Excusa total', names: 'SI. Caro, PT Yairis' },
  { id: '3', count: { of: 0, sub: 0, pt: 1, aux: 0 }, description: 'Licencia de maternidad', names: 'PT. Yohana' },
  { id: '4', count: { of: 0, sub: 0, pt: 0, aux: 1 }, description: 'Hospitalizada', names: 'AUX. Selene' },
  { id: '5', count: { of: 0, sub: 2, pt: 2, aux: 0 }, description: 'Apoyo', names: 'SI Brenda, SI Romero, PT Bello, PT Yeidis' },
  { id: '6', count: { of: 0, sub: 1, pt: 0, aux: 0 }, description: 'Apoyo SEPRO', names: 'SI Mildreth' },
  { id: '7', count: { of: 0, sub: 3, pt: 1, aux: 0 }, description: '', names: 'IT. Karol, SI. Carolina, SI. Aida, PT. Sindy' },
  { id: '8', count: { of: 0, sub: 2, pt: 0, aux: 0 }, description: 'J5 y J5-1', names: 'IJ. León, SI. Conde' },
  { id: '9', count: { of: 0, sub: 1, pt: 0, aux: 0 }, description: 'palito de caucho', names: 'SI. Heidy' },
  { id: '10', count: { of: 0, sub: 1, pt: 0, aux: 2 }, description: 'relación general', names: '' },
  { id: '11', count: { of: 0, sub: 0, pt: 1, aux: 0 }, description: 'retrasada', names: 'PP. Lina' },
];

const INITIAL_RADIOS: RadioItem[] = [
  { id: '1', name: 'IJ Leon' },
  { id: '2', name: 'IT Karol' },
  { id: '3', name: 'IT Rodriguez' },
  { id: '4', name: 'SI Chico (PAÍS)' },
  { id: '5', name: 'SI Ospino' },
  { id: '6', name: 'SI Vargas' },
  { id: '7', name: 'SI Figueroa' },
  { id: '8', name: 'SI Benítez' },
  { id: '9', name: 'SI Guerrero (Claret)' },
  { id: '10', name: 'PT Torres' },
];

const INITIAL_MOTOS: VehicleItem[] = [
  { id: '1', sigla: '50-2008', status: 'Buena' },
  { id: '2', sigla: '50-2010', status: 'Buena' },
  { id: '3', sigla: '50-1740', status: 'Buena' },
  { id: '4', sigla: '50-1653', status: 'Regular Estado' },
  { id: '5', sigla: '50-1739', status: 'Regular Estado' },
  { id: '6', sigla: '50-1529', status: 'Taller de Baja' },
  { id: '7', sigla: '50-1661', status: 'Taller sin placa' },
  { id: '8', sigla: '50-1573', status: 'Taller de Baja' },
];

const INITIAL_VEHICLES: VehicleItem[] = [
  { id: '1', sigla: '50-2315', status: 'Buena' },
  { id: '2', sigla: '50-1799', status: 'Buena' },
  { id: '3', sigla: '50-1498', status: 'varada comando' },
  { id: '4', sigla: '50-1349', status: 'Taller' },
];

// --- Helper Components ---

const InputField = ({ label, value, onChange, type = "text", placeholder = "", disabled = false }: { label: string, value: string | number, onChange: (val: any) => void, type?: string, placeholder?: string, disabled?: boolean }) => (
  <div className={`flex flex-col gap-1 ${disabled ? 'opacity-50' : ''}`}>
    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) || 0 : e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="bg-zinc-100 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-300 transition-all outline-none disabled:cursor-not-allowed"
    />
  </div>
);

const PersonnelInput = ({ label, count, onChange, disabled = false }: { label: string, count: PersonnelCount, onChange: (newCount: PersonnelCount) => void, disabled?: boolean }) => (
  <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
      <Users size={14} /> {label}
    </h3>
    <div className="grid grid-cols-4 gap-2">
      <InputField label="OF" value={count.of} type="number" onChange={(val) => onChange({ ...count, of: val })} disabled={disabled} />
      <InputField label="SUB" value={count.sub} type="number" onChange={(val) => onChange({ ...count, sub: val })} disabled={disabled} />
      <InputField label="PT" value={count.pt} type="number" onChange={(val) => onChange({ ...count, pt: val })} disabled={disabled} />
      <InputField label="AUX" value={count.aux} type="number" onChange={(val) => onChange({ ...count, aux: val })} disabled={disabled} />
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [date, setDate] = useState('06 de marzo del 2026');
  const [unit, setUnit] = useState('GINAD');
  
  const [fe, setFe] = useState<PersonnelCount>({ of: 0, sub: 24, pt: 16, aux: 5 });
  const [fd, setFd] = useState<PersonnelCount>({ of: 0, sub: 10, pt: 4, aux: 3 });
  const [formacion, setFormacion] = useState<PersonnelCount>({ of: 0, sub: 11, pt: 5, aux: 3 });
  const [isAutoFd, setIsAutoFd] = useState(true);
  
  const [novelties, setNovelties] = useState<Novelty[]>(INITIAL_NOVELTIES);
  const [radios, setRadios] = useState<RadioItem[]>(INITIAL_RADIOS);
  const [motos, setMotos] = useState<VehicleItem[]>(INITIAL_MOTOS);
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);

  const [copied, setCopied] = useState(false);

  // --- Automatic Calculation ---
  useEffect(() => {
    if (isAutoFd) {
      const totalNovelties = novelties.reduce((acc, n) => ({
        of: acc.of + n.count.of,
        sub: acc.sub + n.count.sub,
        pt: acc.pt + n.count.pt,
        aux: acc.aux + n.count.aux,
      }), { of: 0, sub: 0, pt: 0, aux: 0 });

      setFd({
        of: Math.max(0, fe.of - totalNovelties.of),
        sub: Math.max(0, fe.sub - totalNovelties.sub),
        pt: Math.max(0, fe.pt - totalNovelties.pt),
        aux: Math.max(0, fe.aux - totalNovelties.aux),
      });
    }
  }, [fe, novelties, isAutoFd]);

  // --- Actions ---

  const addNovelty = () => {
    const newNovelty: Novelty = {
      id: Math.random().toString(36).substr(2, 9),
      count: { of: 0, sub: 0, pt: 0, aux: 0 },
      description: '',
      names: ''
    };
    setNovelties([...novelties, newNovelty]);
  };

  const removeNovelty = (id: string) => {
    setNovelties(novelties.filter(n => n.id !== id));
  };

  const updateNovelty = (id: string, updates: Partial<Novelty>) => {
    setNovelties(novelties.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const addItem = (setter: any, list: any[]) => {
    setter([...list, { id: Math.random().toString(36).substr(2, 9), name: '', sigla: '', status: '' }]);
  };

  const removeItem = (setter: any, list: any[], id: string) => {
    setter(list.filter(item => item.id !== id));
  };

  const updateItem = (setter: any, list: any[], id: string, updates: any) => {
    setter(list.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // --- Formatting ---

  const formatCount = (c: PersonnelCount) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(c.of)}-${pad(c.sub)}-${pad(c.pt)}-${pad(c.aux)}`;
  };

  const generateReport = () => {
    let report = `Parte para hoy del ${date} personal ${unit}.\n\n`;
    
    report += `FE. ${formatCount(fe)}\n`;
    report += `FD. ${formatCount(fd)}\n\n`;
    
    report += `Formación\n`;
    report += `${formatCount(formacion)}\n\n`;
    
    report += `Novedades\n`;
    novelties.forEach(n => {
      const namesPart = n.names ? ` (${n.names})` : '';
      report += `${formatCount(n.count)} ${n.description}${namesPart}\n`;
    });
    
    report += `\n${radios.length.toString().padStart(2, '0')} *Radios de Comunicación*\n`;
    radios.forEach(r => {
      if (r.name) report += `${r.name}\n`;
    });
    
    report += `\n${motos.length.toString().padStart(2, '0')} *Motocicletas*\n`;
    motos.forEach(m => {
      if (m.sigla) report += `*${m.sigla}* ${m.status}\n`;
    });
    
    report += `\n${vehicles.length.toString().padStart(2, '0')} *Vehículos*\n`;
    vehicles.forEach(v => {
      if (v.sigla) report += `*${v.sigla}* ${v.status}\n`;
    });
    
    return report;
  };

  const copyToClipboard = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Editor */}
        <div className="space-y-6">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-900 text-white p-2 rounded-lg">
                <FileText size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Reporte de Personal</h1>
            </div>
            <p className="text-zinc-500 text-sm">Gestiona el parte diario de la unidad {unit}.</p>
          </header>

          {/* General Info */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Fecha" value={date} onChange={setDate} placeholder="Ej: 06 de marzo del 2026" />
            <InputField label="Unidad" value={unit} onChange={setUnit} placeholder="Ej: GINAD" />
          </div>

          {/* Personnel Counts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PersonnelInput label="Fuerza Efectiva (FE)" count={fe} onChange={setFe} />
            <div className="relative">
              <PersonnelInput label="Fuerza Disponible (FD)" count={fd} onChange={setFd} disabled={isAutoFd} />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Auto</span>
                <button 
                  onClick={() => setIsAutoFd(!isAutoFd)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${isAutoFd ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isAutoFd ? 'left-4.5' : 'left-0.5'}`} />
                </button>
              </div>
              {isAutoFd && (
                <div className="absolute inset-x-0 bottom-0 h-full bg-white/10 pointer-events-none rounded-xl" title="Calculado automáticamente" />
              )}
            </div>
            <PersonnelInput label="Formación" count={formacion} onChange={setFormacion} />
          </div>

          {/* Novedades Section */}
          <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <AlertCircle size={16} /> Novedades
              </h2>
              <button 
                onClick={addNovelty}
                className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Agregar Novedad
              </button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {novelties.map((n) => (
                  <motion.div 
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-3 relative group"
                  >
                    <button 
                      onClick={() => removeNovelty(n.id)}
                      className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <InputField label="OF" value={n.count.of} type="number" onChange={(val) => updateNovelty(n.id, { count: { ...n.count, of: val } })} />
                      <InputField label="SUB" value={n.count.sub} type="number" onChange={(val) => updateNovelty(n.id, { count: { ...n.count, sub: val } })} />
                      <InputField label="PT" value={n.count.pt} type="number" onChange={(val) => updateNovelty(n.id, { count: { ...n.count, pt: val } })} />
                      <InputField label="AUX" value={n.count.aux} type="number" onChange={(val) => updateNovelty(n.id, { count: { ...n.count, aux: val } })} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField label="Descripción / Servicio" value={n.description} onChange={(val) => updateNovelty(n.id, { description: val })} placeholder="Ej: Servicios" />
                      <InputField label="Personal (Nombres)" value={n.names} onChange={(val) => updateNovelty(n.id, { names: val })} placeholder="Ej: SI. Caro, PT Yairis" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Equipment Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Radios */}
            <section className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Radio size={14} /> Radios ({radios.length})
                </h2>
                <button onClick={() => addItem(setRadios, radios)} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {radios.map(r => (
                  <div key={r.id} className="flex gap-2 items-center group">
                    <input 
                      value={r.name} 
                      onChange={(e) => updateItem(setRadios, radios, r.id, { name: e.target.value })}
                      className="bg-zinc-50 text-xs p-2 rounded w-full outline-none focus:ring-1 focus:ring-zinc-200"
                    />
                    <button onClick={() => removeItem(setRadios, radios, r.id)} className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Motos */}
            <section className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Bike size={14} /> Motos ({motos.length})
                </h2>
                <button onClick={() => addItem(setMotos, motos)} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {motos.map(m => (
                  <div key={m.id} className="flex flex-col gap-1 p-2 bg-zinc-50 rounded group relative">
                    <input 
                      placeholder="Sigla"
                      value={m.sigla} 
                      onChange={(e) => updateItem(setMotos, motos, m.id, { sigla: e.target.value })}
                      className="bg-transparent text-[11px] font-bold outline-none"
                    />
                    <input 
                      placeholder="Estado"
                      value={m.status} 
                      onChange={(e) => updateItem(setMotos, motos, m.id, { status: e.target.value })}
                      className="bg-transparent text-[10px] text-zinc-500 outline-none"
                    />
                    <button onClick={() => removeItem(setMotos, motos, m.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Vehicles */}
            <section className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Car size={14} /> Vehículos ({vehicles.length})
                </h2>
                <button onClick={() => addItem(setVehicles, vehicles)} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {vehicles.map(v => (
                  <div key={v.id} className="flex flex-col gap-1 p-2 bg-zinc-50 rounded group relative">
                    <input 
                      placeholder="Sigla"
                      value={v.sigla} 
                      onChange={(e) => updateItem(setVehicles, vehicles, v.id, { sigla: e.target.value })}
                      className="bg-transparent text-[11px] font-bold outline-none"
                    />
                    <input 
                      placeholder="Estado"
                      value={v.status} 
                      onChange={(e) => updateItem(setVehicles, vehicles, v.id, { status: e.target.value })}
                      className="bg-transparent text-[10px] text-zinc-500 outline-none"
                    />
                    <button onClick={() => removeItem(setVehicles, vehicles, v.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-400 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-zinc-900 rounded-3xl p-8 text-zinc-300 shadow-2xl shadow-zinc-200 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Vista Previa del Parte</h2>
                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    copied 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {copied ? <CheckCircle2 size={14} /> : <Clipboard size={14} />}
                  {copied ? '¡Copiado!' : 'Copiar Texto'}
                </button>
              </div>

              <div className="bg-zinc-800/50 rounded-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap border border-zinc-700/50 select-all">
                {generateReport()}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Total FE</div>
                  <div className="text-2xl font-bold text-white">
                    {fe.of + fe.sub + fe.pt + fe.aux}
                  </div>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Total FD</div>
                  <div className="text-2xl font-bold text-white">
                    {fd.of + fd.sub + fd.pt + fd.aux}
                  </div>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/30">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Equipos</div>
                  <div className="text-2xl font-bold text-white">
                    {radios.length + motos.length + vehicles.length}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-zinc-800/20 rounded-xl border border-dashed border-zinc-700/50">
                <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                  Este reporte está formateado para WhatsApp. Los elementos entre asteriscos (*) aparecerán en negrita al enviarse.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
      `}</style>
    </div>
  );
}
