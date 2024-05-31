import * as vscode from "vscode";

export class CodeLens implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  constructor() {
    this.regex = /\/\/ CRAFT: /gi;

    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    let matches;
    if ((matches = regex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[0]);
      const position = new vscode.Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(
        position,
        new RegExp(this.regex)
      );
      if (range) {
        this.codeLenses.push(
          new vscode.CodeLens(range, {
            arguments: [line.text],
            title: "SuiCraft 🤖",
            tooltip: "Write a query to get contracts",
            command: "hello-world.generateCode",
          })
        );
      }
    }
    return this.codeLenses;
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ): vscode.CodeLens | Thenable<vscode.CodeLens> {
    const prompt = codeLens.command?.arguments?.[0].toString();
    console.log("Prompt: ", prompt);
    if (prompt) {
      // Call an AI API or service to generate code based on the prompt
      const generatedCode = 'console.log("Hello, World!")';

      // Create a new CodeLens with the generated code
      return new vscode.CodeLens(codeLens.range, {
        command: "hello-world.insertGeneratedCode",
        arguments: [{ snippet: generatedCode }],
        title: "Insert generated code",
      });
    }
    return codeLens;
  }
}
