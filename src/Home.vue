<template>
  <div>
    <h2><strong>Home Page</strong></h2>
    <hr>
    <div id="links">
      <label><router-link :to="{ name: 'petitions'}">View Petitions</router-link></label>
      <br>
      <label><router-link :to="{ name: 'create petition'}">Create a Petition</router-link></label>
      <br>
      <label><router-link :to="{ name: 'my petitions'}">View My Petitions</router-link></label>
      <br>
      <label><router-link :to="{ name: 'profile'}">View My Profile</router-link></label>


      <br/><br/>
      <div v-if="loginFlag == true">
        <button type="button" class="btn btn-primary" data-toggle="modal"
                data-target="#logoutUserModal">
          Log Out
        </button>
      </div>
      <div v-else>
        <button type="button" class="btn btn-primary" v-on:click="goToLogin()">
          Log In
        </button>
      </div>

      <div class="modal fade" id="logoutUserModal" tabindex="-1" role="dialog"
           aria-labelledby="logoutUserModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="logoutUserModalLabel">Log Out</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure that you want to Log Out?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal"
                      v-on:click="logoutUser()">
                Log Out
              </button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        name: "",
        email: "",
        city: "",
        country: "",
        password: "",
        confirmedPassword: "",
        loginFlag: false
      }
    },
    mounted: function() {
      this.checkLogin();
    },
    methods: {
      logoutUser: function() {
        this.$http.post( 'http://localhost:4941/api/v1/users/logout', {},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
        }).then((response) => {
          alert("Successfully Logged Out User");
          localStorage.removeItem("userId");
          localStorage.removeItem("Auth_Token");

          this.$router.push({name: "login"}).catch((err) => {});
          this.checkLogin();
        }).catch((error) => {
          alert("Unsuccessful Logout");
          localStorage.removeItem("userId");
          localStorage.removeItem("Auth_Token");

          this.$router.push({name: "login"}).catch((err) => {});
          this.checkLogin();
          this.error = error;
          this.errorFlag = true;
        });
      },

      checkLogin: function() {
        if (localStorage.getItem("Auth_Token")) {
          this.loginFlag = true;
        } else {
          this.loginFlag = false;
        }
      },

      goToLogin: function() {
        this.$router.push({name: "login"}).catch((err) => {});
      },
    }
  }
</script>


