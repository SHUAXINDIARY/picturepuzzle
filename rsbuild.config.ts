import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    html: {
        template: './index.html',
    },
    output: {
        minify: {
            jsOptions: {
                minimizerOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    }
                }
            }
        }
    },
    source: {
        entry: {
            index: './src/main.tsx',
        },
    },
    plugins: [pluginReact()],
});