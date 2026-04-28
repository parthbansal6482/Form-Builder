import React, { useContext } from 'react';
import { FormContext } from '../context/FormContext';

export default function TopNavBar() {
  const { state, dispatch } = useContext(FormContext);

  return (
    <nav className="flex justify-between items-center w-full px-md h-14 sticky top-0 z-50 bg-surface-container-lowest border-b border-surface-variant flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-h3 text-h3 tracking-tighter text-on-surface">Formly</span>
      </div>
      <div className="flex bg-surface-container p-1 rounded-xl">
        <button 
          className={`rounded-lg px-4 py-1 font-body-md text-body-md font-medium transition-colors ${state.activeTab === 'build' ? 'bg-primary text-on-primary shadow-[0_1px_2px_rgba(0,0,0,0.1)]' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'build' })}
        >
          Build
        </button>
        <button 
          className={`rounded-lg px-4 py-1 font-body-md text-body-md font-medium transition-colors ${state.activeTab === 'preview' ? 'bg-primary text-on-primary shadow-[0_1px_2px_rgba(0,0,0,0.1)]' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'preview' })}
        >
          Preview
        </button>
      </div>
      <div className="flex items-center gap-sm">

        <div className="w-8 h-8 rounded-full bg-surface-variant ml-2 overflow-hidden border border-surface-variant">
          <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADHmYGm5jHZosBCpQbMsbGbzrCPEqKbSaQV-YNZAllVOg5hdRxHilAMmwyrm8Xm36P8PnmBdwnocFHTo6RW0RzEWHKUTkY6VOHA-x2HsLh05ZzH2bxJ5kEDnHoVeX-aAdhnxHf95KBytkEfrAYzZqzz0OF3ms5IM_1vZuG_7HWU4_7MA1QpngPoWhSmuqN0YJCEj4V1D0V_yRW9QXZ8D5KCIYe7jvftasQbPww93pSBsjEsh0Dg5qkNR0CzSJaJfpznOi7YOoIfRA"/>
        </div>
      </div>
    </nav>
  );
}
