import { useThree } from '@react-three/fiber'
// import { Html } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { uuid } from 'short-uuid'
// createPortal,

export function UIContent({ children }) {
  let gl = useThree((s3) => s3.gl)

  useEffect(() => {
    let rootEl = document.createElement('span')
    rootEl.id = '_id_' + uuid()
    let root = createRoot(rootEl)
    root.render(<>{children}</>)
    gl.domElement.parentElement.parentElement.appendChild(rootEl)

    return () => {
      rootEl.remove()
      root.render(<></>)
    }
  }, [children, gl])

  return null
}

UIContent.key = uuid()
