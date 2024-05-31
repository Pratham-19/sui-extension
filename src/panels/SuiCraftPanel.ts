import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
} from "vscode";
import { getUri } from "../utils/getUri";
import { getNonce } from "../utils/getNonce";
import { exec, execSync } from "child_process";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class SuiCraftPanel {
  public static currentPanel: SuiCraftPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * The SuiCraftPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri) {
    if (SuiCraftPanel.currentPanel) {
      // If the webview panel already exists reveal it
      SuiCraftPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        "showHelloWorld",
        "SuiCraft",
        ViewColumn.Six,

        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
          localResourceRoots: [
            Uri.joinPath(extensionUri, "out"),
            Uri.joinPath(extensionUri, "webview-ui/build"),
          ],
        }
      );

      SuiCraftPanel.currentPanel = new SuiCraftPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    SuiCraftPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
            <title>Hello World</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "error":
            console.error(text);
            window.showErrorMessage(text);
            return;
          case "success":
            console.error(text);
            window.showInformationMessage(text);
            return;
          case "deploy":
            console.log("editor", window.visibleTextEditors);
            const activeEditor = window.visibleTextEditors[0];
            if (!activeEditor) {
              window.showErrorMessage("No active editor found");
              return;
            }
            const docUri = activeEditor.document.uri;

            const filePath = docUri.fsPath;
            window.showInformationMessage("Building..");
            try {
              const stdout = execSync(
                ` cd ${filePath
                  .split("/")
                  .slice(0, -1)
                  .join("/")} && sui move build`,
                {
                  encoding: "utf-8",
                }
              );
              window.showInformationMessage(`Build Successful`);
            } catch (error) {
              window.showErrorMessage("Error Building");
              webview.postMessage({
                command: "buildError",
                text: "Build failed pls check logs",
              });
              return;
            }
            try {
              const stdout = execSync(
                ` cd ${filePath
                  .split("/")
                  .slice(0, -1)
                  .join("/")} && sui client publish`,
                {
                  encoding: "utf-8",
                }
              );
              // window.showInformationMessage(`Deploy Successful!`);
              const lines = stdout.split("\n");
              const balanceLine = lines.find((line) => line.includes("Digest"));
              if (balanceLine) {
                const addr = balanceLine.trim().split(/\s+/)[2];
                window.showInformationMessage(`Deployed at ${addr}`);
                webview.postMessage({
                  command: "deployedAddress",
                  text: addr,
                });
              } else {
                window.showErrorMessage("Error fetching balance");
              }
              webview.postMessage({
                command: "deploySuccess",
                text: stdout,
              });
            } catch (error) {
              window.showErrorMessage("Error fetching balance");
              webview.postMessage({
                command: "deployError",
                text: "Deploy failed pls check logs",
              });
            }
            return;
          case "addBal":
            exec("sui client faucet", (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              if (stderr) {
                window.showErrorMessage(`stderr: ${stderr}`);
                return;
              }
              webview.postMessage({
                command: "updateBal",
                text: stdout,
              });
            });
            return;
          case "getAddr":
            exec("sui client active-address", (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              if (stderr) {
                window.showErrorMessage(`stderr: ${stderr}`);
                return;
              }
              webview.postMessage({
                command: "activeAddr",
                text: stdout,
              });
            });
            return;
          case "getEnv":
            exec("sui client active-env", (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              if (stderr) {
                window.showErrorMessage(`stderr: ${stderr}`);
                return;
              }
              webview.postMessage({
                command: "activeEnv",
                text: stdout,
              });
            });
            return;
          case "getBal":
            try {
              const stdout = execSync("sui client balance", {
                encoding: "utf-8",
              });
              const lines = stdout.split("\n");
              const balanceLine = lines.find((line) => line.includes("Sui"));

              if (balanceLine) {
                const balance = balanceLine.trim().split(/\s+/)[4];
                webview.postMessage({
                  command: "activeBal",
                  text: balance,
                });
              } else {
                window.showErrorMessage("Error fetching balance");
              }
            } catch (error) {
              window.showErrorMessage("Error fetching balance");
            }

            return;
          case "deploy":
            try {
              const terminal =
                window.activeTerminal || (await window.createTerminal());
              terminal.sendText('echo "Deploying"');
              terminal.sendText("sui client gas");
              console.log(terminal.state);
            } catch (error) {
              window.showErrorMessage(
                `Error running terminal command: ${error}`
              );
            }
            exec("sui client balance", (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              window.showInformationMessage(`stdout: ${stdout}`);
              console.log(`stdout: ${stdout}`);
              window.showInformationMessage(`stdout: ${stderr}`);
              console.error(`stderr: ${stderr}`);
            });
            return;

          //   window.showInformationMessage("Deploying");
          //   commands.executeCommand("suicraft.deploy");
          //   return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside media/main.js)
        }
      },
      undefined,
      this._disposables
    );
  }
}
