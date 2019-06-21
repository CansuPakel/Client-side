import StockTrader from './components/StockTrader';
import Portfolio from './components/Portfolio';
import Stocks from './components/Stocks';
import Stock from './components/Stock';

export const routes = [
  { path: '/', component: StockTrader, name: 'stockTrader' },
  { path: '/portfolio', component: Portfolio, name:'Portfolio' },
  { path: '/stocks', component: Stocks, children: [
      { path: '', component: Stock },
    ]  },
  { path: '*', redirect: { path: '/' } }
];
