<template>
  <div>
    <ul>
      <app-stock v-for="item in stocks"
                 :key="item.id" :stock="item" > </app-stock>
    </ul>
  </div>
</template>
<script>
  import stock from "./PortfolioStock.vue";
  import { mapGetters } from 'vuex';


  export default {
    computed: {
      ...mapGetters({
        stocks: 'portfolioStocks',
      }),
    },
    components: {
      appStock: stock,
    }
  };
</script>

