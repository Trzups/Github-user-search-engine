<template>
  <div>
    <div id="main">
      <div class="title-search">
        <div class="title">
          <h1>GtHub user search</h1>
        </div>
        <div class="search">
          <SearchUser @user="getUserRepo" />
        </div>
      </div>
      <div v-if="showTable">
        <div class="card">
          <div class="main-card">
            <div>
              <img class="avatar" v-bind:src="avatarUser" />
            </div>
            <div class="user-info">
              <h2>{{ loginUser }}</h2>
              <p v-if="bioUser == null"></p>
              <p v-else>{{ bioUser }}</p>
              <ul class="info">
                <li>{{ followingUser }} <strong>Following</strong></li>
                <li>{{ followersUser }} <strong>Followers</strong></li>
                <li>{{ repoUser.length }} <strong>Repos</strong></li>
              </ul>
            </div>
          </div>
          <h1>Repositories</h1>
          <div id="repos">
            <ul v-for="item in paginatedItems" :key="item">
              <li>
                <strong></strong><a :href="item.url">{{ item.name }}</a>
              </li>
            </ul>
          </div>
          <div class="overflow-auto">
            <b-pagination
              v-model="currentPage"
              class="d-flex justify-content-center"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"></b-pagination>
            <p class="page-number">Current Page: {{ currentPage }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage">
      <strong class="alert alert-danger">{{ errorMessage }}</strong>
    </div>
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
      infoUser: {
        loginUser: "",
        avatarUser: "",
        bioUser: "",
        followingUser: 0,
      },
      repoUser: [],
      showTable: false,
      errorMessage: "",
      perPage: 10,
      currentPage: 1,
      startPage: 0,
    };
  },
  mounted() {
    document.title = "GtHub user search";
  },
  methods: {
    getUserRepo(user) {
      this.errorMessage = "";
      this.showTable = false;
      this.currentPage = 1;
      let loader = this.$loading.show();
      const query = `
      query BIO_QUERY($username: String!) {
  user(login: $username) {
    repositories(first: 100) {
      totalCount
      nodes {
        object(expression: "master") {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
        watchers {
          totalCount
        }
        stargazerCount
        name
        url
        forks {
          totalCount
        }
        pullRequests(states: OPEN) {
          totalCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    avatarUrl
    login
    bio
    following {
      totalCount
    }
    followers {
      totalCount
    }
  }
}
          `;
      const apiGithubGraphl = "https://api.github.com/graphql";
      axios
        .post(apiGithubGraphl, {
          query: query,
          variables: {
            username: user,
          },
        })
        .then((response) => {
          if (response.data.data.user != null) {
            this.repoUser = response.data.data.user.repositories.nodes;
            console.log(response.data.data.user);
            this.avatarUser = response.data.data.user.avatarUrl;
            this.loginUser = user;
            this.bioUser = response.data.data.user.bio;
            this.followingUser = response.data.data.user.following.totalCount;
            this.followersUser = response.data.data.user.followers.totalCount;
            this.showTable = true;
            this.errorMessage = "";
          } else {
            this.showTable = false;
            this.errorMessage = `${response.data.errors[0].message}`;
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          const delay = 500;
          setTimeout(() => {
            loader.hide();
          }, delay);
        });
    },
  },
  computed: {
    rows() {
      return this.repoUser.length;
    },
    paginatedItems() {
      if (this.currentPage == 1) {
        return this.repoUser.slice(this.startPage, this.perPage);
      } else {
        return this.repoUser.slice(
          (this.currentPage - 1) * this.perPage,
          this.currentPage * this.perPage
        );
      }
    },
  },
};
</script>

<style scoped>
.title-search {
  justify-content: center;
}
#main {
  background-color: #2a2a72;
  background-image: linear-gradient(315deg, #2a2a72 0%, #2e2a68 74%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  min-height: 100vh;
}
.card {
  background-color: #4c2885;
  background-image: linear-gradient(315deg, #4c2885 0%, #4c11ac 100%);
  border-radius: 20px;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 800px;
}
.card h1,
p {
  padding: 1rem;
  text-align: center;
}
.main-card {
  display: flex;
  flex-direction: row;
}

.avatar {
  border: 10px solid #2a2a72;
  border-radius: 25%;
  height: 150px;
  width: 150px;
}

.user-info {
  color: #eee;
  margin-left: 2rem;
}

.user-info h2 {
  margin-top: 0;
}

.user-info ul {
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  padding: 0;
  max-width: 400px;
}

.user-info ul li {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.user-info ul li strong {
  font-size: 1rem;
  margin-left: 0.5rem;
}

#repos {
  background-color: #2a2a72;
  border-radius: 5px;
  display: inline-block;
  color: white;
  font-size: 0.7rem;
  padding: 1rem;
  margin: 0.5rem;
  cursor: pointer;
}
#repos ul {
  list-style-type: none;
}
#repos ul li a {
  text-decoration: none;
  color: white;
}
</style>
