import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

import reactLogo from "./assets/react.svg";
import "./App.css";

import { useQueryOwnedCounterValue } from "./hooks/useQueryCounterValue";
import { useMutateCreateCounter } from "./hooks/useMutateCreateCounter";
import { useMutateIncrementCounterValue } from "./hooks/useMutateIncrementCounterValue";
import { useMutateDecrementCounterValue } from "./hooks/useMutateDecrementCounterValue";

function App() {
  const currentAccount = useCurrentAccount();

  const { data } = useQueryOwnedCounterValue();
  const { mutate: mutateCreateCounter } = useMutateCreateCounter();
  const { mutate: mutateIncrementCounterValue } =
    useMutateIncrementCounterValue();
  const { mutate: mutateDecrementCounterValue } =
    useMutateDecrementCounterValue();

  const renderButton = () => {
    if (!currentAccount) return <ConnectButton />;

    if (!data)
      return (
        <button onClick={() => mutateCreateCounter()}>
          Create Counter Object
        </button>
      );

    return (
      <>
        <div className="card">
          <button onClick={() => mutateIncrementCounterValue(data.id.id)}>
            +1
          </button>
        </div>

        <button className="card">{data.value}</button>

        <div className="card">
          <button onClick={() => mutateDecrementCounterValue(data.id.id)}>
            -1
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <a href="https://sui.io" target="_blank">
          <img
            src="https://s3.coinmarketcap.com/static-gravity/image/5bd0f43855f6434386c59f2341c5aaf0.png"
            className="logo"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Sui + React</h1>
      {renderButton()}
    </>
  );
}

export default App;
