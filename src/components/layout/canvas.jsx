import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'

// const LControl = () => {
//   const dom = useStore((state) => state.dom)
//   const control = useRef(null)

//   useEffect(() => {
//     if (control) {
//       dom.current.style['touch-action'] = 'none'
//     }
//   }, [dom, control])
//   // @ts-ignore
//   // return <OrbitControls ref={control} domElement={dom.current} />
//   return <OrbitControls ref={control} />
// }
const LCanvas = ({ children }) => {
  // const dom = useStore((state) => state.dom)

  return (
    <div className='w-full h-full'>
      <Canvas
        mode='concurrent'
        // style={{
        //   position: 'absolute',
        //   top: 0,
        // }}
        // onCreated={(state) => state.events.connect(dom.current)}
      >
        <OrbitControls></OrbitControls>
        {/* <LControl /> */}
        <Preload all />
        {children}
      </Canvas>
    </div>
  )
}

export default LCanvas
