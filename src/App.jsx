import React, { useEffect, useState } from 'react'
import TopButtons from './components/TopButtons/TopButtons'
import Inputs from './components/Inputs/Inputs'
import TimeAndLocation from './components/TimeAndLocation/TimeAndLocation'
import TempAndDetails from './components/TempAndDetails/TempAndDetails'
import ForeCaste from './components/ForeCast/ForeCaste'
import getFormattedWeatherData from './services/WeatherServices'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const App = () => {
  const [query, setQuery] = useState({ q: "buenos aires" })
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState(null)


  const getWeather = async () => {

    const cityName = query.q ? query.q : 'current location'
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`)

    await getFormattedWeatherData({ ...query, units }).then((data) => {
      toast.success(`Fetch weather data for ${data.name}, ${data.country}`)
      setWeather(data)
    })
  }

  useEffect(() => {
    getWeather()
  }, [query, units])

  const formatBackground = () => {
    if (!weather) return 'from-cyan-600 to-blue-700'
    const threshold = units === 'metric' ? 25 : 60
    if (weather.temp <= threshold) return 'from-blue-700'
    return 'from-yellow-700 to-orange-400'
  }

  return (
    <div
      className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 
      bg-gradient-to-br shadow-xl shadow-gray-400 blue ${formatBackground()} `}>
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />
      {
        weather && (
          <>
            <TimeAndLocation weather={weather} />
            <TempAndDetails weather={weather} units={units} />
            <ForeCaste title='3 hour step forecast' data={weather.hourly} />
            <ForeCaste title='daily forecast' data={weather.daily} />
          </>
        )
      }

      <ToastContainer autoClose={2500} hideProgressBar={true} theme='colored' />
    </div>
  )
}

export default App