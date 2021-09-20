import { Toaster } from 'react-hot-toast';
import useToken from './hooks/useToken';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';


function App() {
  const { token, setToken, deleteToken } = useToken();
  return (
    <>
      {
        !token ?
          <Login setToken={setToken} />
          :
          <Dashboard token={token} deleteToken={deleteToken} />
      }
      <Toaster position="bottom-right" />
    </>
  )
}

export default App;
