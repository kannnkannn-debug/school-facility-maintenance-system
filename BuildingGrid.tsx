
import React from 'react';
import { Building, Incident } from '../types';
import { BUILDINGS } from '../constants';
import { playClickSound } from '../utils/sound';

interface BuildingGridProps {
  incidents: Incident[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
}

const BuildingGrid: React.FC<BuildingGridProps> = ({ incidents, selectedBuildingId, onSelectBuilding }) => {
  
  const getIncidentCount = (buildingId: string) => {
    return incidents.filter(i => i.buildingId === buildingId && i.status !== 'Done').length;
  };

  const handleSelect = (id: string | null) => {
    playClickSound();
    onSelectBuilding(id);
  };

  return (
    <div className="glass-panel rounded-xl p-5 h-full relative overflow-hidden flex flex-col">
      {/* HUD Decoration Lines */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-500/30 rounded-tl-xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-500/30 rounded-br-xl pointer-events-none"></div>

      <div className="mb-4 flex justify-between items-end shrink-0">
        <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-wider text-glow">
            แผนผังอาคาร
            </h2>
            <p className="text-[10px] text-cyan-200/50 mt-1 uppercase tracking-widest font-tech">Select sector to filter data</p>
        </div>
        {selectedBuildingId && (
            <button 
                onClick={() => handleSelect(null)}
                className="text-[10px] text-red-400 border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/10 transition-colors uppercase"
            >
                ล้างตัวกรอง
            </button>
        )}
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1 -mr-2 pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 pb-2">
            {BUILDINGS.map(building => {
            const count = getIncidentCount(building.id);
            const isSelected = selectedBuildingId === building.id;
            
            return (
                <button
                key={building.id}
                onClick={() => handleSelect(isSelected ? null : building.id)}
                className={`
                    relative p-3 rounded border text-left transition-all duration-300 group overflow-hidden min-h-[70px]
                    ${isSelected 
                    ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                    : 'bg-slate-900/40 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/60'
                    }
                `}
                >
                {/* Active Indicator Line */}
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>}

                <div className="flex flex-col h-full justify-between gap-1 relative z-10 pl-2">
                    <span className={`text-xs font-bold tracking-wide leading-tight ${isSelected ? 'text-cyan-100' : 'text-slate-400 group-hover:text-cyan-200'}`}>
                    {building.name}
                    </span>
                    
                    {count > 0 && (
                    <span className="absolute top-2 right-2 flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold text-white bg-red-600 border border-red-400 rounded shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse font-tech">
                        {count}
                    </span>
                    )}
                    
                    <div className={`text-[9px] font-mono ${isSelected ? 'text-cyan-400' : 'text-slate-600'} mt-auto font-tech uppercase`}>
                    ID: {building.id}
                    </div>
                </div>

                {/* Hover sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                </button>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default BuildingGrid;
