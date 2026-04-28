import React from 'react';
import { FormProvider } from './context/FormContext';
import TopNavBar from './components/TopNavBar';
import FormCanvas from './components/FormCanvas';
import SidePanel from './components/SidePanel';

export default function FormBuilder() {
  return (
    <FormProvider>
      <div className="bg-surface-container-lowest text-on-surface font-body-md text-body-md h-screen flex flex-col overflow-hidden antialiased selection:bg-surface-container-highest">
        <TopNavBar />
        <div className="flex flex-1 overflow-hidden">
          <FormCanvas />
          <SidePanel />
        </div>
      </div>
    </FormProvider>
  );
}

