<template>
  <div class="home">
    <div>
      <div>
        <h1>GtHub user search</h1>
      </div>
      <SearchUser @user="getUserRepo" />
    </div>
  </div>
  <br />
  <div v-if="showTable">
    <div class="row">
      <div class="d-flex justify-content-center">
        <div>
          <h3>{{ repoUser[0].owner.login }}</h3>
          <figure class="image mb-6">
            <img class="avatar" v-bind:src="repoUser[0].owner.avatar_url" />
          </figure>
        </div>
      </div>
    </div>

    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name repository</th>
            <th scope="col">Stars</th>
          </tr>
        </thead>
        <tbody v-for="(item, index) in repoUser" :key="item">
          <tr>
            <td scope="row">{{ index + 1 }}</td>
            <td>
              <strong>{{ item.name }}</strong>
            </td>
            <td>
              {{ item.stargazers_count }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="errorMessage">
    <strong>{{ errorMessage }}</strong>
  </div>
</template>

<script>
import axios from "axios";
import SearchUser from "@/components/SearchUser.vue";

export default {
  name: "Home",
  components: { SearchUser },
  data() {
    return {
      repoUser: [],
      showTable: false,
      errorMessage: "",
    };
  },
  methods: {
    getUserRepo(user) {
      let loader = this.$loading.show();
      let reposUser = `https://api.github.com/users/${user.login}/repos`;
      axios
        .get(reposUser)
        .then((response) => {
          setTimeout(() => {
            loader.hide();
          }, 2000);
          this.repoUser = response.data;
          this.showTable = true;
          this.errorMessage = "";
        })
        .catch((error) => {
          this.showTable = false;
          this.errorMessage = " Error repositories does not exist";
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 200px;
  height: 200px;
}
</style>
