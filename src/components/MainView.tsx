import React, { useEffect, useReducer } from "react"
import Activity from "./Activity"
import EditorView from "./EditorView"
import Filebar from "./Filebar"
import { init_state, selectActivity, selectCollapsed, selectFile, uiReducer, selectEditor, selectTab} from "./system/StateEngine"
import { Panel } from "./Panel"
import { Tabbar } from "./Tabbar"
import { Statusbar } from "./Statusbar"
import SearchPanel from "./SearchPanel"
import GitPanel from "./GitPanel"
import SettingsPanel from "./SettingsPanel"
import SuiActions from "./SuiActions"

const MainView: React.FC = () => {
 

  useEffect(() => {
    window.fileAPI.onMessage((msg) => alert(msg))
  }, [])
 const [uiState, dispatch] =useReducer(uiReducer,init_state)

  useEffect(() => {
    const loadWorkspace = async () => {
      const session = await window.sessionAPI.loadSession()

      if (session.lastOpenedPath) {
        const isValid = await window.fileAPI.validatePath(session.lastOpenedPath)
        if (isValid) {
          const tree = await window.fileAPI.buildFileTree(session.lastOpenedPath)
          dispatch({ type: 'load-files', files: tree })
          return
        }
      }
      dispatch({ type: 'load-files', files: [] })
    }

    loadWorkspace()
  }, [])



  const renderActivePanel = () => {
    switch (uiState.activityIcon) {
      case 0:
        return (
          <Filebar
            {...selectFile(uiState)}
            dispatch={dispatch}
          />
        )
      case 1:
        return <SearchPanel />
      case 2:
        return <GitPanel />
      case 3:
        return <SettingsPanel />
      case 4:
        return <SuiActions />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300 overflow-hidden">
      <Activity
        {...selectActivity(uiState)}
        dispatch={dispatch}
      />
      {!uiState.sidebarCollapsed && renderActivePanel()}
      <Panel>
        <Tabbar {...selectTab(uiState)} dispatch={dispatch} />
        <EditorView  {...selectEditor(uiState)} dispatch={dispatch} />
        <Statusbar />
      </Panel>
    </div>
  )
}

export default MainView
