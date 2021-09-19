import { Toaster } from 'react-hot-toast';
import useToken from './hooks/useToken';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


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
    <Toaster position="bottom-right"/>
    </>
  )
}

export default App;
