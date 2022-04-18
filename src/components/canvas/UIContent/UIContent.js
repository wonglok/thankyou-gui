import { useThree } from '@react-three/fiber'
// import { Html } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
// createPortal,

export function UIContent({ children }) {
  let { get } = useThree()
  let dom = useRef(document.createElement('div'))
  let proxy = useRef(get().gl.domElement.parentElement.parentElement)

  let root = useMemo(() => {
    let nowGone = dom.current

    let root = createRoot(nowGone)
    return root
  }, [])

  useEffect(() => {
    proxy.current.appendChild(dom.current)
    let now = proxy.current
    let nowGone = dom.current

    root.render(children)

    return () => {
      root.render(<></>)
      now.removeChild(nowGone)
    }
  }, [root, children])

  return null
}
