import { Outlet } from "react-router-dom";
import { ContextProvider } from "./contexts/GlobalContext";

const App = () => {
  return (
    <ContextProvider>
        <main className="grow flex flex-col w-full">
          <Outlet />
        </main>
    </ContextProvider>
  );
};

export default App;
