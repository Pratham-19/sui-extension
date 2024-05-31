import {
  VSCodeBadge,
  VSCodeButton,
  VSCodeDivider,
  VSCodeDropdown,
  VSCodeOption,
  VSCodePanelTab,
  VSCodeTextArea,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";

function App() {
  function handleAddBalance() {
    // Handle add balance logic here
  }

  function handleDeploy() {
    // Handle deploy logic here
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl font-bold">My Dapp</h1>
      <VSCodeDivider />

      <div className="flex flex-col items-center">
        <label className="mb-2">Address:</label>
        <VSCodeTextField
          disabled
          value="0x123456789abcdef"
          placeholder="Enter your address"
        />

        <div className="flex items-center mb-4">
          <label className="mr-4">Tag:</label>
          <VSCodeDropdown>
            <VSCodeOption>Devnet</VSCodeOption>
            <VSCodeOption>Testnet</VSCodeOption>
          </VSCodeDropdown>
        </div>

        <div className="flex justify-center mb-4">
          <label>Balance:</label>
          <VSCodeBadge>1.23 ETH</VSCodeBadge>
          <VSCodeButton onClick={handleAddBalance} className="mr-2">
            Add Balance
          </VSCodeButton>
        </div>
        <VSCodeButton onClick={handleDeploy}>Deploy</VSCodeButton>
      </div>

      <VSCodeDivider />

      <VSCodePanelTab>Logs</VSCodePanelTab>
      <VSCodeTextArea placeholder="Logs will appear here" />
    </main>
  );
}

export default App;
