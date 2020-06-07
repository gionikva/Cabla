<template>
  <div>
    <v-menu
      v-model="menuOpen"
      :close-on-content-click="false"
      v-if="user"
      class="justify-start rounded-sm"
      :offset-y="true"
    >
      <template v-slot:activator="{ on }">
        <v-btn class='ml-2' text v-on="on" fab>
          <v-avatar v-if="user">
            <img class='prof-img' :src="user.photoURL" />
          </v-avatar>
        </v-btn>
      </template>
      <v-window v-model="currentPage">
        <v-window-item>
          <v-list class="d-flex flex-column justify-start">
            <v-list-item>
              <v-list-item-avatar>
                <img :src="user.photoURL" alt="Profile photo" />
              </v-list-item-avatar>
              <v-list-item-title>{{ user.displayName }}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              v-for="item in items.page1"
              :key="item.title"
              class="d-flex justify-start"
              v-on:click="item.action()"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-window-item>
        <v-window-item>
          <v-list class="d-flex flex-column justify-start">
            <v-list-item
              v-for="item in items.page2"
              :key="item.title"
              class="d-flex justify-start"
              v-on:click="item.action"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </v-menu>
    <v-btn v-else-if="!signInStarted && !user" width="6rem" @click="signInGoogle()">
      <v-row align="center">
        <v-icon>mdi-account-circle</v-icon>
        <v-spacer></v-spacer>Sign In
      </v-row>
    </v-btn>
    <v-btn v-else disabled text fab>
      <v-skeleton-loader class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
    </v-btn>
    <ImportExport ref="importExport" v-model="importExportOpen" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ImportExport from "./ImportExport";
export default {
  name: "Login",
  components: {
    ImportExport,
  },
  created() {
    let vm = this;
    this.items = {
      page1: [
        {
          title: "Settings",
          icon: "mdi-cog",
          action() {
            vm.$router.push("/Settings");
            vm.close();
          },
        },
        {
          title: "More",
          icon: "mdi-dots-horizontal",
          action() {
            vm.nextPage();
          },
        },
        {
          title: "Sign Out",
          icon: "mdi-logout-variant",
          action() {
            vm.SignOut();
            vm.close();
          },
        },
      ],
      page2: [
        {
          title: "Export",
          icon: "mdi-export",
          action() {
            vm.$refs.importExport.open("export");
            vm.close();
          },
        },
        {
          title: "Import",
          icon: "mdi-import",
          action() {
            vm.$refs.importExport.open("import");
            vm.close()
          },
        },
        {
          title: "Back",
          icon: "mdi-arrow-left",
          action() {
            vm.previousPage();
          },
        },
      ],
    };
  },
  data() {
    return {
      currentPage: 0,
      menuOpen: false,
      importExportOpen: false,
      items: {},
    };
  },
  methods: {
    ...mapActions("auth", ["SignInWithGoogle", "SignOut", "signInStart"]),
    async signInGoogle() {
      try {
        await this.SignInWithGoogle();
      } catch (error) {
        console.log(error);
      }
    },
    close(){
      this.menuOpen=false;
      this.currentPage = 0;
    },
    nextPage() {
      this.currentPage += 1;
    },
    previousPage() {
      this.currentPage -= 1;
    },
    exportItems() {
      
    },
  },
  computed: mapGetters("auth", {
    user: "getUser",
    signInStarted: "getSignInStarted",
  }),
};
</script>

<style lang="scss" scoped>
  
</style>
