# Dapp Vue3
A simple Dapp built with Vue3, Hardhat, and TypeScript.

## Tech-stack
- vitedf
- hardhat
- typescript
- yarn workspace

## Development
In the project root `./dapp-vue3`

1. Install workspaces dependencies
```
yarn
```
2. Compile contracts and typechain
```
yarn build:contracts
```
3. Run hardhat network on http://localhost:8545 with chainID 31337
```
yarn start:node
```

4. Run frontend dev
```
yarn dev
```

5. Deploy default contract to hardhat network
```
yarn deploy:local
```

## References
This project is heavily inspired by the following awesome projects.

### frontend
#### vue3 with metamask
- vue-composable: https://github.com/pikax/vue-composable/blob/master/packages/vue-composable/src/web/webSocket.ts
- useDapp: https://limaois.me/archives/293
- web3model-vue: https://github.com/SmallRuralDog/web3modal-vue
- vue-tailwind-ethereum-template: https://github.com/chnejohnson/vue-tailwind-ethereum-template
- vue3-eth: https://github.com/samatechtw/vue3-eth

#### metamask
- docs: https://docs.metamask.io/guide/getting-started.html#basic-considerations
- json-rpc-api https://metamask.github.io/api-playground/api-documentation/#wallet_addEthereumChain
- detect-provider: https://github.com/MetaMask/detect-provider/blob/main/src/index.ts

### Monorepo Architecture
#### Yarn workspaces
- https://classic.yarnpkg.com/en/docs/workspaces/

#### Add dependencies
- `yarn workspace @dapp-vue3/frontend add <package> --dev`

#### Project's initial set up
- `npx hardhat`
- `yarn create vite`