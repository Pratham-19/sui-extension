import { VSCodeBadge, VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodePanelTab, VSCodeTextArea, VSCodeTextField, } from "@vscode/webview-ui-toolkit/react";
function App() {
    function handleAddBalance() {
        // Handle add balance logic here
    }
    function handleDeploy() {
        // Handle deploy logic here
    }
    return (<main className="flex flex-col items-center my-10 space-y-5 text-lg w-[80vw] mx-auto">
      <h1 className="text-2xl font-bold">🧙‍♂️ SuiCraft Deployer 🧙‍♂️</h1>

      <VSCodeDivider />

      <div className="flex flex-col items-start">
        <label className="mb-2 text-sm">Address</label>
        <VSCodeTextField disabled value="0x123456789abcdefdfss" className=""/>
      </div>

      <div className="flex flex-col items-start">
        <label className="mb-2 text-sm">Balance</label>
        <VSCodeTextField value="1.23 SUI" className="font-lg"/>
      </div>

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

      <VSCodeDivider />

      <VSCodePanelTab>Logs</VSCodePanelTab>
      <VSCodeTextArea placeholder="Logs will appear here"/>
    </main>);
}
export default App;
//# sourceMappingURL=App.js.map