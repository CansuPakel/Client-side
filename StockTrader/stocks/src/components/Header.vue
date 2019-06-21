<template>
  <header>
    <nav class="navbar">
      <router-link tag="li" to="/"  class="navbar-brand">Stock Trader</router-link>
      <div id="navigation">
        <ul class="navbar-nav">
          <router-link tag="li" to="/portfolio" class="nav-item">
            <a class="nav-link">Portfolio</a>
          </router-link>
          <router-link tag="li" to="/stocks" class="nav-item">
            <a class="nav-link">Stocks</a>
          </router-link>
        </ul>
        <ul class="navbar-toolbar">
          <li class="nav-item">
            <a class="nav-link" @click.prevent="endDay">End Day</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click.prevent="save">Save</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click.prevent="load">Load</a>
          </li>
          <li class="static-item">
            Funds: € {{ funds | currency }}
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { mapActions } from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        funds: 'funds',
      }),
    },
    methods: {
      ...mapActions({
        loadData: "load"
      }),
      endDay () {
        this.$store.dispatch('randomPrijzen')
      },
      save () {
        this.$store.dispatch('save');
      },
      load () {
        this.$store.dispatch('load');
      }
    },
  };
</script>

<style lang="scss" scoped>
  $transition: all .25s cubic-bezier(1,.25,0,.75) 0s;

  header {
    * {
      padding: 0;
      margin: 0;
    }

    .navbar {
      background-color: #f8f9fa;
      padding: 8px 16px;

      .navbar-brand {
        display: inline-block;
        width: 150px;
        text-decoration: none;
        color: #555;
        font-size: 20px;
      }

      #navigation {
        display: inline-block;
        width: calc(100% - 150px);

        .navbar-nav, .navbar-toolbar {
          display: inline-block;

          .nav-item.router-link-exact-active a:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: -5px;
            left: 0;
            background-color: #555;
            visibility: visible;
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
          }

          .active{
            color:red;
          }
          li {
            padding: 8px;
            display: inline-block;

            a {
              text-decoration: none;
              color: #777;
              position: relative;

              &:before {
                content: "";
                position: absolute;
                width: 100%;
                height: 2px;
                bottom: -5px;
                left: 0;
                background-color: #555;
                visibility: hidden;
                -webkit-transform: scaleX(0);
                transform: scaleX(0);
                -webkit-transition: $transition;
                transition: $transition;
              }
              &:hover:before {
                visibility: visible;
                -webkit-transform: scaleX(1);
                transform: scaleX(1);
              }
            }
          }

          li + li {
            margin-left: 10px;
          }
        }

        .navbar-toolbar {
          float: right;
        }

        .static-item {
          color: #555;
        }
      }
    }
  }
</style>
