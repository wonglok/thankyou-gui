import { useLoader, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { EquirectangularReflectionMapping } from 'three'
import { sRGBEncoding } from 'three'
import { RGBELoader } from 'three-stdlib'

export function Env() {
  let tex = useLoader(RGBELoader, `/hdr/greenwich_park_02_1k.hdr`)
  let { scene } = useThree((s) => {
    return {
      scene: s.scene,
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
      {/*  */}
      {/*  */}
    </>
  )
}
