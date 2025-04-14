import React from "react"
import { EditorViewProps, FileNode } from "./system/StateEngine"
import WelcomeView from "./WelcomeView"
const EditorView: React.FC<EditorViewProps> = ({ activeFile, dispatch }) => {
  
  const handleOpenFolder = async () => {
    const selectedPath = await window.fileAPI.promptOpenDialog()
    if (selectedPath) {
      const tree = await window.fileAPI.buildFileTree(selectedPath)
      await window.sessionAPI.saveSession({ lastOpenedPath: selectedPath })
  
      dispatch({ type: 'load-files', files: tree })
  
      const findFirstFile = (nodes: FileNode[]): string | null => {
        for (const node of nodes) {
          if (!node.isFolder && /\.(ts|tsx)$/.test(node.name)) {
            return node.name
          } else if (node.isFolder && node.children) {
            const result = findFirstFile(node.children)
            if (result) return result
          }
        }
        return null
      }
  
      const firstFile = findFirstFile(tree)
      if (firstFile) {
        dispatch({ type: 'open-file', filename: firstFile })
      }
    }
  }
  

  if (!activeFile) {
    return <WelcomeView onOpenClick={handleOpenFolder} />
  }

  const sampleCode = `// Content of ${activeFile}\n// Still working on editor.`

  return (
    <div className="flex-1 bg-gray-900 p-4 overflow-auto">
      <pre className="text-gray-300 whitespace-pre-wrap">
        <code>{sampleCode}</code>
      </pre>
    </div>
  )
}

export default EditorView
