export const REDENV_GITHUB_URL = "https://github.com/redenv-labs/redenv";
export const REDENV_LABS_URL = "https://github.com/redenv-labs";

export const REDENV_PYPI_URL = "https://pypi.org/project/redenv";
export const REDENV_JS_CLIENT_URL = "https://www.npmjs.com/package/@redenv/client";

export const PACKAGE_CONFIG: Record<
    "cli" | "core" | "client" | "python",
    { path: string; displayName: string }
> = {
    cli: { path: "packages/cli/CHANGELOG.md", displayName: "CLI" },
    core: { path: "packages/core/CHANGELOG.md", displayName: "Core" },
    client: { path: "packages/client/CHANGELOG.md", displayName: "JS SDK" },
    python: {
        path: "packages/python-client/CHANGELOG.md",
        displayName: "Python SDK",
    },
};
