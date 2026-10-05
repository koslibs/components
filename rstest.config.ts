import { createUnitTestConfig } from '@koslibs/builder/testing';

export default {
    ...createUnitTestConfig('ui'),
    include: ['src/**/*.test.tsx'],
};
