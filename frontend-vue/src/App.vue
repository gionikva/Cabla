
<template>
  <v-app>
    <Header />
    <Drawer />
    <v-content>
        <router-view :key='$route.fullPath' :collection='collectionize($route.fullPath)' />
      
    </v-content>
  </v-app>
</template>

<script>
import Header from './components/Header';
import Drawer from './components/Drawer';
import {capitalize} from './utils/utils';

export default {
  name: 'app',
  components: {
    Header,
    Drawer,
  },
  methods:{
    collectionize(routePath){
      const finalArray = [];
      routePath.split('/').forEach((collection)=>{
        finalArray.push(capitalize(collection, true))
      })
      return finalArray.join('/')
    }
  }
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
      
    }
  }
}
</style>
