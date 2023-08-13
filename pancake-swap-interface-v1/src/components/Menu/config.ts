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
        label: 'Testnet NSwap',
        href: 'https://nswap.nhancv.com',
      },
      {
        label: 'DApp',
        href: 'https://dapp.nhancv.com',
      },
    ],
  },
]

export default config
