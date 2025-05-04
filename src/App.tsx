import Navbar from "./components/Navbar"
import AnimatedContainer from "./containers/AnimatedContainer"
import SearchPage from "./pages/SearchPage"

function App() {

  return (
    <div className='app-flex app-col app-h-vw-100 app-bg-black'>
      <Navbar />
      <AnimatedContainer
        entry="animate__fadeIn"
        exit="animate__fadeOut"
        isEntering={true}
      >
        <SearchPage />
      </AnimatedContainer>
    </div>
  )
}

export default App
