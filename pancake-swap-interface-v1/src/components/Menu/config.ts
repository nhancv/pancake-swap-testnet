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
        label: 'Chart',
        href: 'https://dex.nhancv.com/0xE0dFffc2E01A7f051069649aD4eb3F518430B6a4',
      },
      {
        label: 'DApp',
        href: 'https://dapp.nhancv.com',
      },
    ],
  },
]

export default config
