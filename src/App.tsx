import AnimatedContainer from "./containers/AnimatedContainer"

function App() {

  return (
    <AnimatedContainer
      entry="animate__fadeIn"
      exit="animate__fadeOut"
      isEntering={true}
    >
      fuck off lance corporal
    </AnimatedContainer>
  )
}

export default App
