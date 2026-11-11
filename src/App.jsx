import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import DayDetail from './pages/DayDetail.jsx'
import PackingList from './pages/PackingList.jsx'
import TravelInfo from './pages/TravelInfo.jsx'
import Phrases from './pages/Phrases.jsx'
import Expenses from './pages/Expenses.jsx'
import Transport from './pages/Transport.jsx'
import Spots from './pages/Spots.jsx'
import Food from './pages/Food.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/day/:dayId" element={<DayDetail />} />
      <Route path="/packing" element={<PackingList />} />
      <Route path="/info" element={<TravelInfo />} />
      <Route path="/phrases" element={<Phrases />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/spots" element={<Spots />} />
      <Route path="/food" element={<Food />} />
    </Routes>
  )
}
