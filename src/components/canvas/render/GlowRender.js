import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { glow } from './glow'
import { TJCore } from './TJCore'

export function GlowRender() {
  let [st, setST] = useState()
  let three = useThree()
  useEffect(() => {
    let vfx = new TJCore({ name: 'core' })

    for (let kn in three) {
      vfx.now[kn] = three[kn]
    }

    glow({ vfx })

    setST(vfx)

    return () => {}
  }, [])

  useFrame(() => {
    if (st) {
      st.work()
    }
  }, 10000)

  return null
}
