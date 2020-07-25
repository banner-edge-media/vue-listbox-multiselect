<template>
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        app
        temporary
      >
        <v-list dense>
          <v-list-item link href="#basic" @click="drawer = false">
            <v-list-item-content>
              <v-list-item-title>Basic</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link href="#groups" @click="drawer = false">
            <v-list-item-content>
              <v-list-item-title>With Groups</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link href="#nosearch" @click="drawer = false">
            <v-list-item-content>
              <v-list-item-title>No Search</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        app
        color="primary"
        dark
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          <v-icon>mdi-menu</v-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Vue Listbox Multiselect</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon href="https://github.com/banner-edge-media/vue-listbox-multiselect" target="_blank"><v-icon>mdi-github</v-icon></v-app-bar-nav-icon>
      </v-app-bar>

      <v-main>
        <v-container class="float-left">
          Please follow installation guide on GitHub: <A href="https://github.com/banner-edge-media/vue-listbox-multiselect" target="_blank">https://github.com/banner-edge-media/vue-listbox-multiselect</A><br/>
          <br/>
          Currently only works with <a href="https://vuetifyjs.com/en/getting-started/quick-start/" target="_blank">Vuetify</a>.<br/>
          <br/>
          <Basic style="max-width:500px" />
          <br/>
          <Groups style="max-width:500px" />
          <br/>
          <NoSearch style="max-width:500px" />
        </v-container>
      </v-main>
    </v-app>
  </template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Groups from '@/components/Groups.vue';
import NoSearch from '@/components/NoSearch.vue';
import Basic from '@/components/Basic.vue';

@Component({
  components: {
    Basic, Groups, NoSearch,
  },
  data() {
    return {
      drawer: false,
    };
  },
})
export default class App extends Vue {}
</script>

<style>
  .model {
    overflow-x: hidden;
    white-space: nowrap;
    font-size: 13px;
    max-height: 100px;
    text-overflow: ellipsis;
  }
</style>
