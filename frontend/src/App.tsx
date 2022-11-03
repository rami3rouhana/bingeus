import Main from './Main';
import Header from './components/ui/Header'
import { GlobalStateProvider } from "./context/GlobalState"

export default function App() {

  return (
    <>
      <div>
        <GlobalStateProvider>
          <Header />
          <Main />
        </GlobalStateProvider>
      </div>
    </>
  )
}