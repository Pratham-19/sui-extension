import {
  commands,
  ExtensionContext,
  languages,
  window,
  SnippetString,
} from "vscode";
import { HelloWorldPanel, CodeLens } from "./panels";
import { getCode } from "./utils/getCode";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export function activate(context: ExtensionContext) {
  const codeLensProvider = new CodeLens();
  languages.registerCodeLensProvider("*", codeLensProvider);

  commands.registerCommand("hello-world.generateCode", generateCode);

  const showHelloWorldCommand = commands.registerCommand(
    "hello-world.showHelloWorld",
    () => {
      HelloWorldPanel.render(context.extensionUri);
    }
  );

  commands.registerCommand("hello-world.insertGeneratedCode", (args) => {
    const editor = window.activeTextEditor;
    console.log(editor, "editor", args);
    if (editor) {
      const snippet = new SnippetString(args.snippet);
      editor.insertSnippet(snippet, editor.selection.active);
    }
  });
  context.subscriptions.push(showHelloWorldCommand);
}

const generateCode = async (args: string) => {
  if (args.length < 9) {
    window.showErrorMessage(`Invalid Query!`);
    return;
  }
  window.showInformationMessage("Crafting with AI.");
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const document = editor.document;
  const selection = editor.selection;
  let query = args.split("CRAFT:")[1];
  const code = await getCode(query);
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, `\n${code}`);
  });
};
