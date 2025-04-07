import React from "react"

export const Panel = ({children}:React.PropsWithChildren)=>{
	return (
		<div className="flex-1 flex flex-col">
			{children}
		</div>)
}
