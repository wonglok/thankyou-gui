import dynamic from 'next/dynamic'
// Step 5 - delete Instructions components
import Instructions from '@/components/dom/Instructions'
import { Suspense } from 'react'
// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const ShaderCompos = dynamic(
  () => import('@/components/canvas/Shader/Shader'),
  {
    ssr: false,
  }
)

// dom components goes here
const DOM = () => {
  return (
    // Step 5 - delete Instructions components
    <>
      <Instructions />
      <div className='absolute top-0 left-0 '>123</div>
    </>
  )
}

// canvas components goes here
const R3F = () => {
  return (
    <>
      <ShaderCompos />
    </>
  )
}

const Page = () => {
  return (
    <>
      <Suspense fallback={null}>{/*  */}</Suspense>
      <DOM />
      {/* @ts-ignore */}
      <R3F r3f />
    </>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
