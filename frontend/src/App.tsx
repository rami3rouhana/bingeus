import Main from './Main';
import { GlobalStateProvider } from "./context/GlobalState"

export default function App() {

  return (
    <>
      <div>
        <GlobalStateProvider>
          <Main />
        </GlobalStateProvider>
      </div>
    </>
  )
}