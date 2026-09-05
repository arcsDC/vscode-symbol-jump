import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const nextCmd = vscode.commands.registerCommand('symbolJump.next', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const doc = editor.document;
        const pos = editor.selection.active;
        const symbols = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', doc.uri)
            .then((syms: any[]) => {
                const flat: any[] = [];
                const walk = (s: any) => { flat.push(s); s.children?.forEach(walk); };
                syms.forEach(walk);
                const next = flat.find(s => s.range.start.line > pos.line || (s.range.start.line === pos.line && s.range.start.character > pos.character));
                if (next) {
                    const range = new vscode.Range(next.range.start, next.range.start);
                    editor.selection = new vscode.Selection(range.start, range.start);
                    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
                }
            });
    });

    const prevCmd = vscode.commands.registerCommand('symbolJump.prev', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const doc = editor.document;
        const pos = editor.selection.active;
        vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', doc.uri)
            .then((syms: any[]) => {
                const flat: any[] = [];
                const walk = (s: any) => { flat.push(s); s.children?.forEach(walk); };
                syms.forEach(walk);
                const prev = [...flat].reverse().find(s => s.range.start.line < pos.line || (s.range.start.line === pos.line && s.range.start.character < pos.character));
                if (prev) {
                    const range = new vscode.Range(prev.range.start, prev.range.start);
                    editor.selection = new vscode.Selection(range.start, range.start);
                    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
                }
            });
    });

    context.subscriptions.push(nextCmd, prevCmd);
}

export function deactivate() {}
