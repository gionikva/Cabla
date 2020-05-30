<template>
  <v-app-bar tile hide-on-scroll app>
    <v-btn icon class="nav-btn" @click="toggleDrawer()">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="display-1 app-title">Cabla</v-toolbar-title>
    <v-divider class="mx-4 d-none d-sm-flex" vertical inset></v-divider>
    <div class="title font-weight-thin d-none d-sm-flex">{{ currentRouteDisplay }}</div>
    <v-spacer></v-spacer>
    <keep-alive>
      <Search
        :key="'search'"
        v-if="( currentRoute.fullPath.toLowerCase().match(/(collections|words)/g) || currentRoute.fullPath.toLowerCase().indexOf('archived')  != -1) && (user)"
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
import Login from "./Login";
export default {
  name: "Header",
  components: {
    Search,
    Login,
  },
  created() {
    this.BindSignIn();
    this.$vuetify.theme.dark = this.darkMode;
  },
  methods: {
    ...mapActions("navigation", ["toggleDrawer"]),
    ...mapActions("auth", ["BindSignIn", "signInStart"])
  },
  computed: {
    ...mapGetters("auth", {
      user: "getUser"
    }),
    ...mapGetters("settings", {
      darkMode: "getDark"
    }),
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
    }
  },
  watch: {
    darkMode(newvalue) {
      this.$vuetify.theme.dark = newvalue;
    }
  }
};
</script>

<style>
.search {
  max-width: 12rem;
}
</style>