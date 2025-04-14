import React, { useEffect, useState, useRef, use } from "react"
import * as monaco from 'monaco-editor';
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

  const editorRef = useRef<HTMLDivElement | null>(null)
  const editorInitialized = useRef(false)
  const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (editorRef.current && !editorInitialized.current && activeFile) {
      monacoInstance.current = monaco.editor.create(editorRef.current, {
        value: content,
        language: language,
        theme: "vs-dark",
        automaticLayout: true,
      })
      editorInitialized.current = true
    }
  
    return () => {
      monacoInstance.current?.dispose()
      editorInitialized.current = false
    }
  }, [activeFile])
  
  


  useEffect(() => {
    const loadContent = async () => {
      if (activeFile) {
        const fileContent = await window.fileAPI.loadFile(activeFile)
        const ext = activeFile.split('.').pop()
        console.log("File extension:", ext)
  
        const newLanguage = ext === "ts" || ext === "tsx" ? "typescript"
          : ext === "js" ? "javascript"
          : ext === "json" ? "json"
          : ext === "py" ? "python"
          : ext === "rs" ? "rust"
          : "plaintext";

        setLanguage(newLanguage)
        setContent(fileContent || "// File not found or empty")
  
        // Update editor content and language after state updates
        if (monacoInstance.current) {
          monacoInstance.current.setValue(fileContent || "// File not found or empty")
          monaco.editor.setModelLanguage(monacoInstance.current.getModel()!, newLanguage)
        }
      }
    }
  
    loadContent()
}, [activeFile])
  

  return (
    <div className="flex-1 bg-gray-900 w-full h-full overflow-hidden">
      {!activeFile ? (
        <WelcomeView onOpenClick={handleOpenFolder} />
      ) : (
        <div
          ref={editorRef}
          style={{
            width: "100%",
            height: "100vh",
          }}
        />
      )}
    </div>
  )
  
}

export default EditorView
