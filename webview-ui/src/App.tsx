import {
  VSCodeBadge,
  VSCodeButton,
  VSCodeDivider,
  VSCodeTextArea,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import "./index.css";
import { useState } from "react";
import { Loader } from "lucide-react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  function handleAddBalance() {
    setIsLoadingBal(true);
    // Handle add balance logic here
  }

  function handleDeploy() {
    setIsLoading(true);
    // Handle deploy logic here
  }

  return (
    <main className="flex flex-col items-center my-10 space-y-5 text-lg font-cascadia w-1/2 mx-auto ">
      <h1 className="text-2xl font-bold">🧙‍♂️ SuiCraft Deployer 🧙‍♂️</h1>

      <VSCodeDivider />

      <div className="flex flex-col items-start relative w-1/3">
        <label className="mb-2 text-base">Address</label>
        <VSCodeTextField disabled value="0x123456789abcdefdfss" />
        <VSCodeDivider />
        <label className="mt-2 mb-2 text-base">Balance: 1.2 SUI</label>
        <VSCodeButton onClick={handleAddBalance} className="w-full">
          Add Gas
          {isLoadingBal && (
            <Loader className="animate-spin ease-in-out  my-auto ml-2" />
          )}
        </VSCodeButton>
        <VSCodeBadge className="absolute right-0 ">Devnet</VSCodeBadge>
      </div>

      <VSCodeButton onClick={handleDeploy} className="w-1/3 bg-[#4ba721]">
        Deploy
        {isLoading && (
          <Loader className="animate-spin ease-in-out  my-auto ml-2" />
        )}
      </VSCodeButton>

      <VSCodeDivider />

      <label className="mb-2 text-base">Logs</label>
      <VSCodeTextArea
        placeholder="Logs will appear here"
        className="w-1/3 min-h-[150px]"
      />
    </main>
  );
}

export default App;
