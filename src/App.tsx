import { Fragment } from 'react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Blog from 'pages/blog'

function App() {
  return (
    <Fragment>
      <ToastContainer />
      <Blog />
    </Fragment>
  )
}

export default App
