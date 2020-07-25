<script lang="ts">
import Vue from 'vue';
import VueListboxMultiselect from '@banneredge/vue-listbox-multiselect';
import dataSet from './states';

export default Vue.extend({
  name: 'Basic',
  components: {
    VueListboxMultiselect,
  },
  data() {
    return {
      selectedList: [] as any[],
    };
  },
  methods: {
    async search(query: string): Promise<any[]> {
      const ids = this.selectedList.map((x) => x.id);
      let subset = dataSet.filter((x) => !ids.includes(x.abbreviation));

      if (query) {
        const q = query.toLowerCase();
        subset = subset.filter((x) => x.abbreviation.toLowerCase().includes(q)
          || x.name.toLowerCase().includes(q));
      }

      return subset.map((x: any) => ({
        id: x.abbreviation,
        value: x.name,
      }));
    },
  },
});
</script>

<template>
  <vue-listbox-multiselect
    v-model="selectedList"
    :search-function="search"
    placeholder="Search States"
    size="medium"
    :hide-search="false"
  />
</template>
