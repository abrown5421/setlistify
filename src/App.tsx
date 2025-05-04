import { useEffect } from "react";
import Navbar from "./components/Navbar"
import AnimatedContainer from "./containers/AnimatedContainer"
import SearchPage from "./pages/SearchPage"
import AuthPage from "./pages/AuthPage"
import { useAppSelector } from "./store/hooks"

function App() {
  const activePage = useAppSelector(state => state.activePage);
  useEffect(()=>{console.log(activePage)}, [activePage])
  return (
    <div className='app-flex app-col app-h-vw-100 app-bg-black'>
      <Navbar />
      <AnimatedContainer isEntering={activePage.In && activePage.Name === 'Auth'}>
        <AuthPage />
      </AnimatedContainer>
      <AnimatedContainer isEntering={activePage.In && activePage.Name === 'Search'}>
        <SearchPage />
      </AnimatedContainer>
      
    </div>
  )
}

export default App
