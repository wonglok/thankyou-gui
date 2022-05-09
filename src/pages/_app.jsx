import { useRouter } from 'next/router'
import useStore from '@/helpers/store'
import { useEffect } from 'react'
import Header from '@/config'
// import partition from '@/helpers/partition'
import '@/styles/index.css'
// import dynamic from 'next/dynamic'
import '../helpers/bvh'
import LCanvas from '@/components/layout/canvas'
//
// import Dom from '@/components/layout/dom'

// const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
//   ssr: false,
// })

const CanvasInsert = ({ child }) => {
  // const [r3f, dom] = partition(child, (c) => c.props.r3f === true)

  return (
    <>
      <LCanvas>{child}</LCanvas>
    </>
  )
}

function App({ Component, pageProps = { title: 'index' } }) {
  const router = useRouter()

  useEffect(() => {
    useStore.setState({ router })
  }, [router])

  // const child = Component(pageProps).props.children

  return (
    <>
      <Header title={pageProps.title} />
      <LCanvas>
        <Component></Component>
      </LCanvas>
      {/* <CanvasInsert child={child} /> */}
    </>
  )
}

export default App
