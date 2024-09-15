import React from 'react'
import ShowInput from './component/ShowInput'
import FirstPage from './component/FirstPage'
import FarmerTable from './component/FarmerTable'
import './App.css'

const App = () => {
  return (
    <>
      <div className='w-full flex justify-center'>
        <div className="p-10 m-5 border border-gray-300 w-full max-w-4xl bg-white rounded-lg flex flex-col">
          <FirstPage />
          <ShowInput />
        </div>
      </div>
    </>

  )
}

export default App
