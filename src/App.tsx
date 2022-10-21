import { useKeplr } from "./features/keplr";
import { StakeForm } from "./features/keplr/components";
import { AuthzForm } from "./features/keplr/components";
import "./App.css";

function App() {
  const { extensionNotInstalled } = useKeplr();

  return (
    <div className="App">
      <h1>Keplr React Starter</h1>
      <div className="card">
        {extensionNotInstalled ? (
          <div>
            Install{" "}
            <a href="https://www.keplr.app/" rel="noreferrer" target="_blank">
              Keplr Wallet
            </a>
          </div>
        ) : (
          <>
            <AuthzForm />
            <StakeForm />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
