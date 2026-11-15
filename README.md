## Prerequisites

- Node.js 20.x (Recommended)

## Installation

**Using Yarn (Recommended)**

```sh
yarn install
yarn dev
```

**Using Npm**

```sh
npm i
npm run dev
```

The app runs without a backend or Clerk configuration. Sofa2 admin/dealer access is a
local demo only; it is not real authentication, and changes are stored in this browser.

## Build

```sh
yarn build
# or
npm run build
```

## Local demo data

The UI uses local mock data. Sofa2 admin/dealer edits and quote requests persist in
browser `localStorage`; clearing site data resets the demo.

## Full version

- Create React App ([migrate to CRA](https://docs.minimals.cc/migrate-to-cra/)).
- Next.js
- Vite.js

## Starter version

- To remove unnecessary components. This is a simplified version ([https://starter.minimals.cc/](https://starter.minimals.cc/))
- Good to start a new project. You can copy components from the full version.
- Make sure to install the dependencies exactly as compared to the full version.

---

**NOTE:**
Optional third-party authentication providers may still require their own environment variables.
