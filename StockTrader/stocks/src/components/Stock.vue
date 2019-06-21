<template>
  <div class="stock" >
  <li>
    <div class="item">{{ stock.naam }}  (Price: {{ stock.prijs }})</div>
    <input placeholder="Quantity" v-model.number="quantity">
    <button @click="buyStock">Buy</button>
  </li>
  </div>

</template>
<script>

  export default {
    props: ['stock'],
    data(){
    return{
      quantity:0,
    };
    },
    methods:{
      buyStock () {
        this.$store.dispatch('buyStock', {
          id: this.stock.id,
          quantity: this.quantity
        });
      },
    },
    computed:{
      getFunds(){
        return this.$store.getters.funds;
      },
    }
  };
</script>

<style scoped>
  .item{
    background-color: #90bb91;
    padding:0.5rem;
    color:white;
  }

  li {
    margin-bottom: 1rem;
    list-style-type: none;

  }

  input{
    margin-top:0.5rem;
    margin-left:0.5rem;
  }

  button{
    float:right;
    margin-top:0.5rem;
    margin-right:0.5rem;
  }

  .stock{
    border:0.1rem solid lightgrey;
    display:block;
    float:left;
    width:45%;
    margin:0.7rem;
  }
</style>
