<template>
  <div class="border">
    <h1>Trade or View your Portfolio</h1>
    <p>
     You may Save or Load your Data <br>
     Click on 'End Day' to begin a new Day
    </p>
    <hr>
    <p>Your Funds: {{ funds | currency }}</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        funds: 'funds',
      }),
    }
  };
</script>

<style  scoped>
  div{
   margin-top:2rem;
   border:1px solid black;
   padding:2rem;
  }
</style>
