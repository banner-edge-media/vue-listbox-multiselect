<script lang="ts">
import Vue from 'vue';
import VueListboxMultiselect from '@banneredge/vue-listbox-multiselect';

const dataSet = ['Apples', 'Oranges', 'Grapes', 'Bananas', 'Pineapples', 'Mangoes'];

export default Vue.extend({
  name: 'NoSearch',
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
      const subset = dataSet.filter((x) => !ids.includes(x));

      return subset.map((x: any) => ({
        id: x,
        value: x,
      }));
    },
  },
});
</script>

<template>
  <div>
    <h2 id="nosearch">No Search</h2>
    <ul>
      <li>Simple List</li>
      <li>Search Hidden</li>
      <li>Default Size</li>
      <li><a href="https://github.com/banner-edge-media/vue-listbox-multiselect/blob/master/demo/src/components/NoSearch.vue"
             target="_blank">View Code</a></li>
    </ul>
    <br/>
    <div class="model">Model: {{selectedList}}</div>
    <br/>
  <vue-listbox-multiselect
    v-model="selectedList"
    :search-function="search"
    placeholder="Search Fruit"
    :hide-search="true"
  />
</div>
</template>
