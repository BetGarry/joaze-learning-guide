import { useEffect, useRef } from 'react'
import initWebgi from './webgiInit'


export interface WebgiViewerProps {
  paramsRef: React.RefObject<HTMLDivElement>
  setSessionManager?: (sessionManager: any) => void
}

export default function WebgiViewer({ paramsRef, setSessionManager }: WebgiViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current && paramsRef.current) {
      initWebgi(canvasRef.current, paramsRef.current, setSessionManager)
    }
  }, [paramsRef, setSessionManager])

  return (
    <div className="w-full h-full relative">

      <canvas ref={canvasRef} id="webgi-canvas" className="w-full h-full" />
    </div>
  )
}

