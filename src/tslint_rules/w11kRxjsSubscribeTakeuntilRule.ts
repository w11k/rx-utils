import {tsquery} from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import {getObservableSubscribeExpression, hasLiftScopedBeforeSubscribe, hasPipeTakeUntilBeforeSubscribe} from "./util";

// noinspection JSUnusedGlobalSymbols
export class Rule extends Lint.Rules.TypedRule {

    // noinspection JSUnusedGlobalSymbols
    static metadata: Lint.IRuleMetadata = {
        description: "Enforces that `.pipe(..., takeUntil(...))` is called before `.subscribe()`.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "w11k-rxjs-subscribe-takeuntil",
        type: "style",
        typescriptOnly: true
    };

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const failures: Lint.RuleFailure[] = [];
        let relevantClasses: ts.Node[] = tsquery(sourceFile, "ClassDeclaration");

        relevantClasses.forEach(classDeclaration => {
            const subscribeExpression = getObservableSubscribeExpression(classDeclaration, program);
            subscribeExpression.forEach(node => {

                let isSafe = hasPipeTakeUntilBeforeSubscribe(node) || hasLiftScopedBeforeSubscribe(node);
                if (!isSafe) {
                    const propertyAccessExpression = node as ts.PropertyAccessExpression;
                    const {name} = propertyAccessExpression;
                    failures.push(new Lint.RuleFailure(
                        sourceFile,
                        name.getStart(),
                        name.getStart() + name.getWidth(),
                        "Missing `.pipe(..., takeUntil(...))` before .subscribe()",
                        this.ruleName
                    ));
                }
            });
        });
        return failures;
    }
}
