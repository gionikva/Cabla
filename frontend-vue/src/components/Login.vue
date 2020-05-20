<template>
  <div width="2rem">
    <div v-if="user">
      <v-menu class="justify-start rounded-sm" :offset-y="true">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" fab>
            <v-avatar v-if="user">
              <img :src="user.photoURL" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="d-flex flex-column justify-start">
          <v-list-item>
            <v-list-item-avatar>
              <img :src="user.photoURL" alt="Profile photo" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{user.displayName}}</v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="d-flex justify-start" v-on:click="$router.push('Settings')">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="align-text-left">Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="d-flex justify-start" v-on:click="SignOut()">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="align-text-left">Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else-if="!signInStarted && !user">
      <v-btn width="6rem" @click="signInGoogle()">
        <v-row align="center">
          <v-icon>mdi-account-circle</v-icon>
          <v-spacer></v-spacer>Sign In
        </v-row>
      </v-btn>
    </div>
    <div v-else>
      <v-btn disabled text fab>
        <v-skeleton-loader class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Login",
  methods: {
    ...mapActions("auth", ["SignInWithGoogle", "SignOut", "signInStart"]),
    async signInGoogle() {
      try {
        await this.SignInWithGoogle();
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: mapGetters("auth", {
    user: "getUser",
    signInStarted: "getSignInStarted"
  }),
  mounted() {
    console.log(this.user);
  }
};
</script>

<style>
</style>