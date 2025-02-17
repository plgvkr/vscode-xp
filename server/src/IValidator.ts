import {
	Diagnostic, DiagnosticSeverity
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

export abstract class IValidator {
	constructor(protected _languageIds: string[] ) {}
	abstract validateImpl(textDocument: TextDocument) : Promise<Diagnostic[]>

	async validate(textDocument: TextDocument) : Promise<Diagnostic[]> {
		if(!this._languageIds.includes(textDocument.languageId)) {
			return [];
		}

		return this.validateImpl(textDocument);
	}

	protected getDiagnosticByRegExpResult(
		lowerCallResult : RegExpExecArray,
		textDocument : TextDocument,
		message : string,
		diagnosticSeverity : DiagnosticSeverity) : Diagnostic {
		const commonMatch = lowerCallResult[0];
	
		// Выделяем всё сравнение как ошибку. 
		// lower(event_src.subsys) == "Directory Service"
		const startPosition = lowerCallResult.index;
		const endPosition = lowerCallResult.index + commonMatch.length;

		const diagnostic: Diagnostic = {
			severity: diagnosticSeverity,
			range: {
				start: textDocument.positionAt(startPosition),
				end: textDocument.positionAt(endPosition)
			},
			message: message,
			source: 'xp'
		};

		return diagnostic;
	}

	protected getDiagnostics(
		foundString : string,
		textDocument : TextDocument,
		message : string,
		diagnosticSeverity : DiagnosticSeverity) : Diagnostic {
	
		const diagnostics : Diagnostic[] = [];
		const text = textDocument.getText();

		const startPosition = text.indexOf(foundString);
		const endPosition = startPosition + foundString.length;

		const diagnostic: Diagnostic = {
			severity: diagnosticSeverity,
			range: {
				start: textDocument.positionAt(startPosition),
				end: textDocument.positionAt(endPosition)
			},
			message: message,
			source: 'xp'
		};

		return diagnostic;
	}
}