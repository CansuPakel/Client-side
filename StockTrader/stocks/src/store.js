import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

Vue.use(Vuex);
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    stocks: [
      {id:0, naam:'BMW',prijs:110},
      {id:1, naam:'Google',prijs:200},
      {id:2, naam:'Apple',prijs:250},
      {id:3, naam:'Twitter',prijs:100},
    ],
    funds:10000,
    portfolioStocks:[],
  },
  getters: {
    funds: state => {
      return state.funds;
    },
    portfolioStocks(state) {
      return state.portfolioStocks;
    },
    stocks: state =>{
      return state.stocks;
    },
    getPriceStyle:state => (id) =>{
      return state.stocks[id].prijs;
    }
  },

  mutations: {
    buyStock (state, item) {
      let stockPrijs = item.quantity * state.stocks[item.id].prijs;
      if (state.funds - stockPrijs >= 0) {
        state.stocks[item.id].quantity += item.quantity;
        state.funds -= (item.quantity * state.stocks[item.id].prijs);

        state.portfolioStocks.push({
          id: state.portfolioStocks.length,
          naam: state.stocks[item.id].naam,
          prijs: state.stocks[item.id].prijs,
          quantity: item.quantity,
          stockId: state.stocks[item.id].id,
        });
      }
      console.log(state.portfolioStocks);
    },

    sellStock(state, item) {
      if (state.portfolioStocks[item.id].quantity - item.quantity >= 0) {
        state.portfolioStocks[item.id].quantity -= item.quantity;
        state.funds += (item.quantity * state.portfolioStocks[item.id].prijs);
      }
      if(state.portfolioStocks[item.id].quantity == 0){
        state.portfolioStocks.splice(
          state.portfolioStocks[item.id].id,1
        );
        console.log("test");
      }
      console.log(state.portfolioStocks);
    },
    randomPrijzen(state){
      state.stocks.forEach(stock => {
        stock.prijs = Math.floor( Math.random() * (150 - 100) + 100);
      });
    }
  },
  actions: {
    buyStock: (commit, item) => {
      commit.commit('buyStock', item);
    },
    sellStock: (commit, item) => {
      commit.commit('sellStock', item);
    },
    randomPrijzen: ({commit}) => {
      commit('randomPrijzen');
    },
    save: commit => {
       let data = JSON.stringify(context.state.stocks);
       Vue.http.post("http://localhost:3000/stocks",
         JSON.stringify(commit.state.stocks),
         {
           headers:
             {
               "content-type": "application/json"
             }
         })
         .then(
              response => {
                // success
              },
              response => {
                // error
              }
         );
       },
    load: commit => {
      Vue.http.get('http://localhost:3000/stocks/last')
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
        });
    }
  },
});
