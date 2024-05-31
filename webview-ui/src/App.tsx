import {
  VSCodeBadge,
  VSCodeButton,
  VSCodeDivider,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import "./index.css";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { vscode } from "./vscode";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [buildError, setBuildError] = useState("");
  const [deployError, setDeployError] = useState("");
  const [deployAddr, setDeployAddr] = useState("");
  const [envr, setEnvr] = useState("testnet");
  const [bal, setBal] = useState(0);
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  function handleAddBalance() {
    setIsLoadingBal(true);
    if (!address || !envr) {
      return;
    }
    vscode.postMessage({
      command: "addBal",
      text: "",
    });
    setTimeout(() => {
      setIsLoadingBal(false);
    }, 5000);
  }

  function handleDeploy() {
    setIsLoading(true);
    vscode.postMessage({
      command: "deploy",
      text: "hwllno",
    });
    // Handle deploy logic here
  }

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "scriptResult") {
        console.log("Received script result:", message.text);
      }
      if (message.command === "activeAddr") {
        console.log("Received script result:", message.text);
        setAddress(message.text);
      }
      if (message.command === "activeEnv") {
        console.log("Received script result:", message.text);
        setEnvr(message.text);
      }
      if (message.command === "activeBal") {
        console.log("Received script result:", message.text);
        setBal(message.text);
      }
      if (message.command === "buildError") {
        console.log("Received script result:", message.text);
        setBuildError(message.text);
      }
      if (message.command === "deployError") {
        console.log("Received script result:", message.text);
        setDeployError(message.text);
      }
      if (message.command === "deployedAddress") {
        console.log("Received script result:", message.text);
        setDeployAddr(message.text);
      }
      if (message.command === "updateBal") {
        console.log("Received script result:", message.text);
        setTimeout(() => {
          vscode.postMessage({
            command: "getBal",
            text: "",
          });
        }, 10000);
      }
    });
  }, []);

  useEffect(() => {
    vscode.postMessage({
      command: "getAddr",
      text: "",
    });
    vscode.postMessage({
      command: "getEnv",
      text: "",
    });
    vscode.postMessage({
      command: "getBal",
      text: "",
    });
  }, []);

  return (
    <main className="flex flex-col items-center my-10 space-y-5 text-lg font-cascadia w-[90vw] mx-auto ">
      <h1 className="text-2xl font-bold">🧙‍♂️ SuiCraft Deployer 🧙‍♂️</h1>

      <VSCodeDivider />

      <div className="flex flex-col items-start relative w-[80%]">
        <label className="mb-2 text-base">Address</label>
        <VSCodeTextField disabled value={address} className="w-full" />
        <VSCodeDivider />
        <label className="mt-2 mb-2 text-base">Balance: {bal} SUI</label>
        <VSCodeButton onClick={handleAddBalance} className="w-full">
          Add Gas
          {isLoadingBal && (
            <Loader className="animate-spin ease-in-out  my-auto ml-2" />
          )}
        </VSCodeButton>
        <VSCodeBadge className="absolute right-0 ">{envr}</VSCodeBadge>
      </div>

      <VSCodeButton onClick={handleDeploy} className="w-[80%] bg-[#4ba721]">
        Deploy
        {isLoading && (
          <Loader className="animate-spin ease-in-out  my-auto ml-2" />
        )}
      </VSCodeButton>

      <VSCodeDivider />

      <label className="mb-2 text-base">Logs</label>
      {buildError && <p className="text-red-500">{buildError}</p>}
      {deployError && <p className="text-red-500">{deployError}</p>}
      {deployAddr && (
        <div className="text-center">
          <h2>🎉 Succesfully Deployed 🎉</h2>
          <a
            href={`https://suiscan.xyz/${envr}/tx/${deployAddr}`}
            className="text-blue-600 text-sm"
          >
            {deployAddr}
          </a>
        </div>
      )}
    </main>
  );
}

export default App;
