<script lang="ts">
import Vue from 'vue';
import VueListboxMultiselect from '@/vue-listbox-multiselect.vue';
import dataSet from './usCities';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueListboxMultiselect
  },
  data() {
    return {
      selectedList: [] as any[],
    };
  },
  methods: {
    async search(query: string): Promise<any[]> {
      const ids = this.selectedList.map((x) => x.id);
      let subset = dataSet.filter((x) => !ids.includes(`${x.state}-${x.city}`));

      if (!query) {
        subset = subset.slice(0, 100);
      } else {
        const q = query.toLowerCase();
        subset = subset.filter((x) => x.city.toLowerCase().includes(q) || x.state.toLowerCase().includes(q));
        subset = subset.slice(0, 100);
      }

      return subset.map((x: any) => {
        return {
          id: `${x.state}-${x.city}`,
          value: x.city,
          group: x.state
        }
      });
    },
  },
});
</script>

<template>
  <v-app id="app">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <vue-listbox-multiselect
        v-model="selectedList"
        :search-function="search"
        placeholder="Search Items"
        style="width: 300px; margin: 20px auto"
    />
  </v-app>
</template>
