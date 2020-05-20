<template>
  <v-navigation-drawer temporary app v-model="open">
    <v-list nav>
      <div class="pages primary--text" align="left">Pages</div>
      <router-link
        class="link"
        v-for="routeItem in routeItems"
        :key="routeItem.path"
        :to="routeItem.path"
      >
        <v-list-item @click="open=false" class="d-flex justify-start" dense link>
          <v-list-item-icon>
            <v-icon>{{ routeItem.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ routeItem.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "Drawer",
  data() {
    return {
      routeItems: [
        {
          name: "Home",
          icon: "mdi-home",
          path: "/"
        },
        {
          name: "Default",
          icon: "mdi-text-box",
          path: "/words/default"
        },
        {
          name: "Archived Words",
          icon: "mdi-package-down",
          path: "/words/archived"
        },
        {
          name: "About",
          icon: "mdi-information",
          path: "/about"
        },
        {
          name: "Settings",
          icon: "mdi-cog",
          path: "/settings"
        },
        
      ]
    };
  },

  computed: {
    ...mapState("navigation", ["drawerOpen"]),
    ...mapGetters("firebase", {
      user: "getUser"
    }),
    open: {
      get() {
        return this.drawerOpen;
      },
      set(opn) {
        this.$store.commit("navigation/setDrawerOpen", opn);
      }
    }
  },
 /*  watch: {
    user: newUser => {
      if (newUser) {
        this.routeItems.splice(1, 0, {
          name: "Words",
          icon: "mdi-text-box",
          path: "/words"
        });
        console.log("changed");
        console.log(this.routeItems);
      } else {
        this.routeItems.splice(1, 1);
      }
    }
  } */
};
</script>

<style>
.pages {
  padding-left: 0.5rem;
}
.link {
  text-decoration: none;
}
</style>