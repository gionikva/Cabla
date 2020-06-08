<template>
  <v-app-bar tile hide-on-scroll scroll-off-screen app>
    <v-btn icon class="nav-btn" @click="toggleDrawer()">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="headline app-title">Cabla</v-toolbar-title>
    <template v-if="windowWidth > 30">
      <v-divider inset vertical class="mx-3"></v-divider>
      <BreadCrumbs delimiter='mdi-chevron-right' v-if="windowWidth > 35" :items="routeItems" />
    </template>
    <template v-if="windowWidth <= 45" v-slot:extension>
      <BreadCrumbs delimiter='mdi-chevron-right' v-if="windowWidth <= 35" :items="routeItems" />
      <v-spacer></v-spacer>
      <Search
        :key="'search'"
        :width="searchWidth"
        v-if="
          (currentRoute.fullPath.toLowerCase().match(/(collections|words)/g) ||
            currentRoute.fullPath.toLowerCase().indexOf('archived') != -1) &&
            user
        "
        class="search"
      />
    </template>
    <v-spacer></v-spacer>
    <keep-alive>
      <Search
        :key="'search'"
        v-if="
          (currentRoute.fullPath.toLowerCase().match(/(collections|words)/g) ||
            currentRoute.fullPath.toLowerCase().indexOf('archived') != -1) &&
            user && windowWidth >= 45
        "
        class="search"
      />
    </keep-alive>
    <Login />
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { capitalize } from "../shared/utils";
import Search from "./Search";
import Login from "./menu/Login";
import BreadCrumbs from './BreadCrumbs';
export default {
  name: "Header",
  components: {
    Search,
    Login,
    BreadCrumbs
  },
  data() {
    return {
       windowWidth: window.innerWidth / parseFloat(getComputedStyle(document.querySelector("html"))["font-size"]),
    }
   
  },
  created() {
    this.BindSignIn();
    this.$vuetify.theme.dark = this.darkMode;
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth / parseFloat(getComputedStyle(document.querySelector("html"))["font-size"]);
    });
  },
  methods: {
    ...mapActions("navigation", ["toggleDrawer"]),
    ...mapActions("auth", ["BindSignIn", "signInStart"]),
  },
  computed: {
    ...mapGetters("auth", {
      user: "getUser",
    }),
    ...mapGetters("settings", {
      darkMode: "getDark",
    }),
    searchWidth(){
      if (this.windowWidth >= 45){
        return '15rem'
      } else if(this.windowWidth >= 25){
        return '8rem'
      } else{
          return '5rem'
      }
    },
    currentRoute() {
      return this.$route;
    },
    currentRouteDisplay() {
      let toDisplay = "";
      if (this.currentRoute.fullPath != "/") {
        this.currentRoute.fullPath.split("/").forEach((token, index, array) => {
          if (0 < index && index < array.length - 1) {
            toDisplay += capitalize(token) + " > ";
          } else {
            toDisplay += capitalize(token);
          }
        });
      } else {
        return "Home";
      }

      return toDisplay;
    },

    routeItems() {
      const splitArr = this.currentRoute.fullPath.split("/").filter((item) => item !== "");
      
      const toRet = splitArr.map((item, index, array) => {
        let href = "/";
        if (index > 0) {
          [...Array(index).keys()].forEach(() => (href += `${array[index - 1]}/`));
        }
        href += item;
        let title = index == 0? capitalize(item) : item;
       
        
        return {
          title,
          link:href,
        };
      });
      if (toRet.length == 0){
        return [{
          title: 'Home',
          link: '/'
        }]
      } else {
        return toRet
      }
    },
  },
  watch: {
    darkMode(newvalue) {
      this.$vuetify.theme.dark = newvalue;
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumbs-extension {
  display: none;
}

@media only screen and (max-width: 50rem) {
  /* For mobile phones: */
  .breadcrumbs-extension {
    display: block;
  }

  .breadcrumbs-side {
    display: none;
  }
}

.search {
  max-width: 12rem;
}
</style>
