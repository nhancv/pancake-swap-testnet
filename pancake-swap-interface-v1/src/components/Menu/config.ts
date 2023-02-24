import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    initialOpenState: true,
    items: [
      {
        label: 'Exchange',
        href: '/swap',
      },
      {
        label: 'Liquidity',
        href: '/pool',
      },
      {
        label: 'Arbitrum Goerli',
        href: 'https://pcs-arb.nhancv.com',
      },
      {
        label: 'DApp',
        href: 'https://dapp.nhancv.com',
      },
      {
        label: 'Lucky Money',
        href: 'https://dapp.nhancv.com/lucky',
      },
    ],
  },
]

export default config
