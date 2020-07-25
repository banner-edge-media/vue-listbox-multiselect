<template>
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-list dense>
          <v-list-item link href="#basic">
            <v-list-item-content>
              <v-list-item-title>Basic</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link href="#categories">
            <v-list-item-content>
              <v-list-item-title>Categories</v-list-item-title>
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
        <v-app-bar-nav-icon href="https://github.com/banner-edge-media/vue-listbox-multiselect"><v-icon>mdi-github</v-icon></v-app-bar-nav-icon>
      </v-app-bar>

      <v-main>
        <v-container class="float-left">
          Please follow installation guide on GitHub: <A href="https://github.com/banner-edge-media/vue-listbox-multiselect">https://github.com/banner-edge-media/vue-listbox-multiselect</A>
          <h2 id="basic">Basic</h2>
          <Basic style="max-width:400px" />
          <br/>
          <h2 id="categories">Categories</h2>
          <Categories style="max-width:400px" />
        </v-container>
      </v-main>
    </v-app>
  </template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Categories from '@/components/Categories.vue';
import Basic from './components/Basic.vue';

@Component({
  components: {
    Basic, Categories,
  },
  data() {
    return {
      drawer: true,
    };
  },
})
export default class App extends Vue {}
</script>
