<template>
  <div class="home">
    <div>
      <h1>GtHub user search</h1>
    </div>
    <SearchUser @user="getUserRepo" />
  </div>
</template>

<script>
import SearchUser from "@/components/SearchUser.vue";
export default {
  name: "Home",
  components: { SearchUser },
  data() {
    return {};
  },
  methods: {
    getUserRepo(user) {
      console.log(user);
    },
  },
};
</script>
