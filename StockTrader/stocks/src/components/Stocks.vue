<template>
  <div>
    <ul>
      <app-stock v-for="item in stocks"
                 :key="item.id" :stock="item" > </app-stock>
    </ul>
  </div>
</template>
<script>
  import Stock from './Stock.vue';
  import { mapGetters } from 'vuex';


  export default {
    computed: {
      ...mapGetters({
        stocks: 'stocks',
      }),
    },
    components: {
      appStock: Stock,
    }
  };
</script>
