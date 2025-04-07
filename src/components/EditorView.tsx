
import React from "react";



 const EditorView = ()=>{
    return(
        <>
        
        <div className="flex-1 bg-gray-900 p-4 overflow-auto">
          <pre className="text-gray-300"><code>{sampleCode}</code></pre>
        </div>
        
      </>
    )
}

const sampleCode = `// This is a sample React component
import React from 'react';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>SUI Hackaton</h1>
      </header>
      <main>
        <p>Welcome the SUI Editor experience!</p>
      </main>
    </div>
  );
};

export default App;`;

export default EditorView;