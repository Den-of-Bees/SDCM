import React from 'react'

const WelcomeView: React.FC<{ onOpenClick: () => void }> = ({ onOpenClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-300">
      <h1 className="text-2xl mb-4">Welcome to SDCM</h1>
      <p className="mb-6">Open a folder or file to get started</p>
      <button
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        onClick={onOpenClick}
      >
        Open Folder
      </button>
    </div>
  )
}

export default WelcomeView
