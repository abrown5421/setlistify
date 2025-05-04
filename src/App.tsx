import Navbar from "./components/Navbar"
import AnimatedContainer from "./containers/AnimatedContainer"
import SearchPage from "./pages/SearchPage"
import { useAppSelector } from "./store/hooks"

function App() {
  const activePage = useAppSelector(state => state.activePage);
  return (
    <div className='app-flex app-col app-h-vw-100 app-bg-black'>
      <Navbar />
      <AnimatedContainer isEntering={activePage.In && activePage.Name === 'Search'}>
        <SearchPage />
      </AnimatedContainer>
      <AnimatedContainer entry="animate__fadeInUpBig" exit="animate__fadeOutDownBig" isEntering={activePage.In && activePage.Name === 'Auth'}>
        login stuff here
      </AnimatedContainer>
    </div>
  )
}

export default App
