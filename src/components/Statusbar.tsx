import { GitBranch } from "lucide-react";

export const Statusbar = () =>{
  return (
    <div className="bg-blue-900 text-gray-300 px-4 py-1 flex justify-between">
          <div className="flex items-center text-sm">
            <GitBranch size={14} className="mr-2" />
            <span>main</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-4">Ln 1, Col 1</span>
            <span className="mr-4">Spaces: 2</span>
            <span>UTF-8</span>
          </div>
        </div>
  )
}