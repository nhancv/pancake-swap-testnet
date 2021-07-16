
## Preparing source

- Clone `pancake-swap-core`
```
git clone git@github.com:pancakeswap/pancake-swap-core.git
cd pancake-swap-core
git checkout -b factory 3b214306770e86bc3a64e67c2b5bdb566b4e94a7
yarn install
yarn compile
```

- Clone `pancake-swap-periphery`
```
git clone git@github.com:pancakeswap/pancake-swap-periphery.git
cd pancake-swap-periphery
git checkout -b router d769a6d136b74fde82502ec2f9334acc1afc0732
yarn install
yarn add @uniswap/v2-core@"file:../pancake-swap-core"
yarn compile
```

- Clone `pancake-swap-interface-v1`
```
git clone git@github.com:pancakeswap/pancake-swap-interface-v1.git
cd pancake-swap-interface-v1
git checkout -b v1 0257017f2daaae2f67c24ded70b5829f74a01b3c
yarn install
```


## Setup

### Install contract merger: https://www.npmjs.com/package/sol-merger
```
npm install sol-merger -g
```

### Prepare `PancakeFactory` and `PancakeRouter01`
```
sol-merger pancake-swap-core/contracts/PancakeFactory.sol ./build
sol-merger pancake-swap-periphery/contracts/PancakeRouter01.sol ./build
```

### Deploy `PancakeFactory` and `PancakeRouter01`

- Access: https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null&version=soljson-v0.5.16+commit.9c3226ce.js

#### Deploy WBNB

+ New File: WBNB.sol => Copy source from https://gist.github.com/nhancv/b0b35f16472e4998d0fd17b7a1e4f707
+ Compiler tab => Select compiler: v0.4.18+commit.9cf6e910
+ Deploy tab => Select WBNB -> Deploy

#### Deploy PancakeRouter

+ New File: PancakeFactory.sol => Copy source from ./build/PancakeFactory.sol
+ Compiler tab => Select compiler: v0.5.16+commit.9c3226ce
+ Deploy tab => Select PancakeFactory -> Fill your address as feeToSetter in constructor -> Deploy

#### Deploy PancakeRouter01

+ New File: PancakeRouter01.sol => Copy source from ./build/PancakeRouter01.sol
+ Expand PancakeFactory deployed above -> Read INIT_CODE_PAIR_HASH -> Copy this hash without prefix `0x`. Ex: bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539
+ Edit PancakeRouter01: Find PancakeLibrary -> pairFor function => Replace new hex by INIT_CODE_PAIR_HASH above. Ex: `hex'd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'` -> hex'bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539'
+ Compiler tab => Select compiler: v0.6.6+commit.6c089d02
+ Deploy tab => Select PancakeRouter01 -> Fill PancakeFactory address and WBNB address as constructor params -> Deploy

#### Setup Frontend

- Update .env
```
cd pancake-swap-interface-v1
cp .env.development .env
```

- Update new `ROUTER_ADDRESS` to `src/constants/index.ts`

- Update support chain to testnet: `src/connectors/index.ts`

```
Change: 
export const bscConnector = new BscConnector({ supportedChainIds: [56] })

To:
export const bscConnector = new BscConnector({ supportedChainIds: [97] })

```

- Update `FACTORY_ADDRESS` và `INIT_CODE_HASH` at  `node_modules/@pancakeswap-libs/sdk/dist/constants.d.ts`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.development.js` and `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.production.min.js`

- Update `WBNB` address at `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.development.js` and `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.production.min.js`

- Custom your own tokens
	+ Create tokens and update info to `src/constants/token/pancakeswap.json`
	+ Remember update token icon with name as token address in lowercase mode to `public/images/coins`

- Custom menu at `src/components/Menu/config.ts`

### Start and Build Frontend

- Start
```
yarn start
```

- Build
```
yarn build
```
