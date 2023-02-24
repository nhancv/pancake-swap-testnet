
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

### Prepare `PancakeFactory` and `PancakeRouter`
```
sol-merger pancake-swap-core/contracts/PancakeFactory.sol ./build
sol-merger pancake-swap-core/contracts/PancakePair.sol ./build
sol-merger pancake-swap-periphery/contracts/PancakeRouter01.sol ./build
sol-merger pancake-swap-periphery/contracts/PancakeRouter.sol ./build
```

### Deploy `PancakeFactory` and `PancakeRouter`

- Access: https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null&version=soljson-v0.5.16+commit.9c3226ce.js

#### Deploy WBNB

+ New File: `WBNB.sol` => Copy source from https://gist.github.com/nhancv/b0b35f16472e4998d0fd17b7a1e4f707
+ Compiler tab => Select compiler: `v0.8.3+commit.8d00100c`
+ Deploy tab => Select `WBNB` -> Deploy

#### Deploy PancakeFactory

+ New File: `PancakeFactory.sol` => Copy source from `./build/PancakeFactory.sol`
+ Compiler tab => Select compiler: `v0.5.16+commit.9c3226ce`
+ Deploy tab => Select `PancakeFactory` -> Fill your address as `feeToSetter` in constructor -> Deploy

#### Deploy PancakeRouter01

+ New File: `PancakeRouter01.sol` => Copy source from `./build/PancakeRouter01.sol`
+ Expand `PancakeFactory` deployed above -> Read `INIT_CODE_PAIR_HASH` -> Copy this hash without prefix `0x`. Ex: `bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539`
+ Edit `PancakeRouter01`: Find `PancakeLibrary` -> `pairFor` function => Replace new hex by `INIT_CODE_PAIR_HASH` above. Ex: `hex'd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'` -> `hex'bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539'`
+ Compiler tab => Select compiler: `v0.6.6+commit.6c089d02`
+ Deploy tab => Select `PancakeRouter01` -> Fill `PancakeFactory` address and `WBNB` address as constructor params -> Deploy

#### Deploy PancakeRouter (Main Router)

+ New File: `PancakeRouter.sol` => Copy source from `./build/PancakeRouter.sol`
+ Expand `PancakeFactory` deployed above -> Read `INIT_CODE_PAIR_HASH` -> Copy this hash without prefix `0x`. Ex: `bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539`
+ Edit `PancakeRouter`: Find `PancakeLibrary` -> `pairFor` function => Replace new hex by `INIT_CODE_PAIR_HASH` above. Ex: `hex'd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'` -> `hex'bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539'`
+ Compiler tab => Select compiler: `v0.6.6+commit.6c089d02`; Check on `Enable optimization: 200` to avoid `Contract code size limit` issue
+ Deploy tab => Select `PancakeRouter` -> Fill `PancakeFactory` address and `WBNB` address as constructor params -> Deploy


#### Setup Frontend

- Update .env
```
cd pancake-swap-interface-v1
cp .env.development .env
```

- Update `PancakeRouter` address to `ROUTER_ADDRESS` at `src/constants/index.ts`
  
- Update support chain to testnet at `src/connectors/index.ts`
	+ Change from `supportedChainIds: [56, 97]` to `supportedChainIds: [97]`
	+ Change from `56` to `97`

- Update `PancakeFactory` address and code hash to `FACTORY_ADDRESS` and `INIT_CODE_HASH` at `node_modules/@pancakeswap-libs/sdk/dist/constants.d.ts`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.development.js`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.production.min.js` and `node_modules/@pancakeswap-libs/sdk/dist/sdk.esm.js`

- Update `PancakeFactory` address to `v2 factory`; `PancakeRouter01` address to `v2 router 01` and `PancakeRouter` address to `v2 router 02` at `src/state/swap/hooks.ts`

- Update `WBNB` address at `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.development.js`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.production.min.js`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.esm.js`

- VERIFY CHANGES by `Find All` old addresses and replace new ones:
	+ WBNB:            0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e
	+ PancakeFactory:  0xBCfCcbde45cE874adCB698cC183deBcF17952812
	+ INIT_CODE_HASH:  0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66
	+ PancakeRouter01: 0xf164fC0Ec4E93095b804a4795bBe1e041497b92a
	+ PancakeRouter:   0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F
	
- Deploy your own tokens
	+ Deploy your own tokens and update info (token address + chainId to 97) to `src/constants/token/pancakeswap.json`
	+ Remember update token icon with name as token address in lowercase mode to `public/images/coins`
	+ Update support network from `ChainId.MAINNET` to `ChainId.BSCTESTNET` at `src/constants/index.ts`
	+ Update coin addresses to your at `src/constants/index.ts`
	+ Update `src/components/Menu/index.tsx`: From `priceData.data[CAKE.address].price` to `priceData.data[CAKE.address]?.price ?? 0`
	+ Update `src/hooks/useGetDocumentTitlePrice.ts`: From `priceData.data[CAKE.address].price` to `priceData.data[CAKE.address]?.price ?? 0`
	
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

### Deployment

- WBNB:            0x0dE8FCAE8421fc79B29adE9ffF97854a424Cad09
- PancakeFactory:  0x5Fe5cC0122403f06abE2A75DBba1860Edb762985
- INIT_CODE_HASH:  0xbb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539
- PancakeRouter01: 0x3E2b14680108E8C5C45C3ab5Bc04E01397af14cB
- PancakeRouter:   0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0
- Frontend:        https://pcs.nhancv.com 

**Tokens**

- BAKE Token: 0xb289b361a633A9D2b0B39BAE76BB458d83f58CEC
- BUSD Token: 0xE0dFffc2E01A7f051069649aD4eb3F518430B6a4
- ETH Token:  0xE282a15DBad45e3131620C1b8AF85B7330Cb3b4B
- USDT Token: 0x7afd064DaE94d73ee37d19ff2D264f5A2903bBB0
- XRP Token:  0x3833B175Af1900b457cf83B839727AF6C9cF0bEe
- DAI Token:  0x3Cf204795c4995cCf9C1a0B3191F00c01B03C56C
- CAKE Token: 0xB8F5B50ed77596b5E638359d828000747bb3dd89

--------

## Arbitrum Goerli Pancakeswap
- Repo: https://github.com/nhancv/pancake-swap-arbitrum-goerli
- Web: https://pcs-arb.nhancv.com
- Addresses
```
- WBNB:            0xD8bbeA7e504851b0aa1c37475E7601c590cFa0B4
- PancakeFactory:  0x259E9786BB40eb5F656dbc16e15538a2340c2554
- INIT_CODE_HASH:  0x9fe1b508f2b0a84ca3b07189bfa32dd3309fb04b5ddec5e0456a232004b07194
- PancakeRouter01: 0x706B5c92d9E7fFD2dd50e56A69906C287C6C5550
- PancakeRouter:   0x8b707e7578059aD857f228FA63E82AA80E132b97
- Multicall:       0xb4B23070BE725100435457CE2E887aB716575EB2
```
