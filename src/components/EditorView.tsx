import React, { useEffect, useState } from "react"
import MonacoEditor from "@monaco-editor/react"
import { EditorViewProps, FileNode } from "./system/StateEngine"
import WelcomeView from "./WelcomeView"

const EditorView: React.FC<EditorViewProps> = ({ activeFile, dispatch }) => {
  const [content, setContent] = useState("// Loading...")
  const [language, setLanguage] = useState("typescript")

  const handleOpenFolder = async () => {
    const selectedPath = await window.fileAPI.promptOpenDialog()
    if (selectedPath) {
      const tree = await window.fileAPI.buildFileTree(selectedPath)
      await window.sessionAPI.saveSession({ lastOpenedPath: selectedPath })
      dispatch({ type: 'load-files', files: tree })

      const firstFile = findAnyFile(tree)
      if (firstFile) dispatch({ type: 'open-file', filename: firstFile.name, filePath: firstFile.path })
    }
  }

  const findAnyFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (!node.isFolder) return node
      if (node.children) {
        const result = findAnyFile(node.children)
        if (result) return result
      }
    }
    return null
  }
  

  useEffect(() => {
    const loadContent = async () => {
      if (activeFile) {
        const fileContent = await window.fileAPI.loadFile(activeFile)
        console.log("File content loaded:", fileContent)
        if (!fileContent) {
          setContent("// File not found or empty")
          return
        }
        setContent(fileContent)

        const ext = activeFile.split('.').pop()
        if (ext === "ts" || ext === "tsx") setLanguage("typescript")
        else if (ext === "js") setLanguage("javascript")
        else if (ext === "json") setLanguage("json")
        else if (ext === "move") setLanguage("plaintext")
        else if (ext === "rs") setLanguage("rust")
        else if (ext == "py") setLanguage("python")
        else setLanguage("plaintext")
      }
    }

    loadContent()
  }, [activeFile])

  if (!activeFile) return <WelcomeView onOpenClick={handleOpenFolder} />

  return (
    <div className="flex-1 bg-gray-900 p-0 overflow-hidden">
      <MonacoEditor
        height="100%"
        theme="vs-dark"
        language={language}
        value={content}
        onChange={(value) => {
          }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

export default EditorView
