import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { importCases } from './imports/cases.mjs';
import { createImportFixture, readBundle, unusedMarker } from './imports/fixture.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

test('public component imports', async (context) => {
    const fixture = await createImportFixture(root, importCases);
    context.after(fixture.cleanup);

    await context.test('all component subpaths provide JS and declarations', async (subcontext) => {
        for (const component of fixture.components) {
            await subcontext.test(component.name, async () => {
                await access(component.module);
                await access(component.types);
            });
        }
    });

    for (const scenario of importCases) {
        await context.test(scenario.component, async () => {
            const bundle = await readBundle(fixture.output(scenario.component));
            for (const kind of ['js', 'css', 'assets']) {
                assert.doesNotMatch(
                    bundle[kind],
                    unusedMarker,
                    `${scenario.component}: unrelated component ${kind} must be absent`
                );
                for (const pattern of scenario.includes?.[kind] ?? []) {
                    assert.match(
                        bundle[kind],
                        pattern,
                        `${scenario.component}: expected ${kind} matching ${pattern}`
                    );
                }
                for (const pattern of scenario.excludes?.[kind] ?? []) {
                    assert.doesNotMatch(
                        bundle[kind],
                        pattern,
                        `${scenario.component}: unexpected ${kind} matching ${pattern}`
                    );
                }
            }
        });
    }
});
