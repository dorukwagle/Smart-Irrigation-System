import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    globals: true,
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    isolate: false,
    pool: 'forks', // Use forks instead of threads
    poolOptions: {
      forks: {
        singleFork: true, // Run all tests in a single fork
      },
    },
    fileParallelism: false, // Disable file parallelism
  },
  resolve: {
    alias: {
      "@": "/src", // Maps '@' to 'src' folder
    },
  },
});
