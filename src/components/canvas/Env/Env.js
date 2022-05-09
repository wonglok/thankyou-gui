import { useLoader, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { EquirectangularReflectionMapping } from 'three'
import { sRGBEncoding } from 'three'
import { RGBELoader } from 'three-stdlib'

export function Env({ url }) {
  let tex = useLoader(RGBELoader, url)
  let { scene } = useThree((st) => {
    return {
      scene: st.scene,
    }
  })
  useEffect(() => {
    tex.mapping = EquirectangularReflectionMapping
    tex.encoding = sRGBEncoding
    scene.environment = tex
    scene.background = tex
  }, [tex, scene])
  return (
    <>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </>
  )
}
