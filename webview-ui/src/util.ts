import { vscode } from "./vscode";

export const addBal = async (
  address: string,
  network: "devnet" | "testnet"
) => {
  if (!address) {
    vscode.postMessage({
      command: "error",
      text: "No address provided",
    });
    console.error("no wallet provided");
    return;
  }
  try {
    const url = `https://faucet.${network}.sui.io/gas`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        FixedAmountRequest: {
          recipient: address,
        },
      }),
    });
    if (resp.ok) {
      vscode.postMessage({
        command: "success",
        text: "Balance added successfully",
      });
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    vscode.postMessage({
      command: "error",
      text: "Error adding balance",
    });
    return false;
  }
};
