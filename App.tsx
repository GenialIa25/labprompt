import React from 'react';
import { Header } from './components/Header';
// FIX: The error "is not a module" is resolved by creating the PromptManager component file and ensuring the relative path is correct.
import { PromptManager } from './components/PromptManager';

function App() {
  return (
    <div className="bg-slate-900 h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-grow overflow-hidden">
        <PromptManager />
      </main>
    </div>
  );
}

export default App;