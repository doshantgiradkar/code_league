import { Outlet } from "react-router-dom";
import { ContextProvider } from "./contexts/GlobalContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <ContextProvider>
        <main className="grow flex flex-col w-full">
          <Navbar/>
          <Outlet />
          <Footer/>
        </main>
    </ContextProvider>
  );
};

export default App;
