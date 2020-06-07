<template>
  <v-app-bar tile hide-on-scroll scroll-off-screen app>
    <v-btn icon class="nav-btn" @click="toggleDrawer()">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="headline app-title">Cabla</v-toolbar-title>
    <template v-if="windowWidth > 30">
      <v-divider inset vertical class="mx-3"></v-divider>
      <v-breadcrumbs large color="primary mx-0" :items="routeItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </template>
    <template v-if="windowWidth <= 45" v-slot:extension>
      <v-breadcrumbs  v-if="windowWidth <= 35" large color="primary mx-0" :items="routeItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
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
export default {
  name: "Header",
  components: {
    Search,
    Login,
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
      if (splitArr.length === 0) {
        splitArr.push("home");
      }
      return splitArr.map((item, index, array) => {
        let href = "/";
        if (index > 0) {
          [...Array(index).keys()].forEach(() => (href += `${array[index - 1]}/`));
        }
        href += item;
        return {
          text: index == 0? capitalize(item) : item,
          disabled: false,
          link:true,
          href,
        };
      });
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
