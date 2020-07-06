<template>
  <div>
    <div v-if="$route.name === 'register'">
      <h2><strong>Register:</strong></h2>
      <form>
        <p><strong>Profile Picture: </strong><input type="file" accept="image/*" @change="onChange" /></p>
        <p><input v-model="name" placeholder="Name" required /></p>
        <p><input v-model="email" placeholder="Email" required /></p>
        <p><input v-model="city" placeholder="City" /></p>
        <p><input v-model="country" placeholder="Country" /></p>
        <p><input v-model="password" placeholder="Password" required type="password" /></p>
        <p><input v-model="confirmedPassword" placeholder="Confirm Password" required type="password" /></p>

        <button type="button" class="btn btn-primary" data-toggle="modal"
                data-target="#registerUserModal">
          Register
        </button>


        <router-link :to="{ name: 'login'}">Cancel</router-link>
      </form>
    </div>

    <div v-else>
      <h2><strong>Login:</strong></h2>
      <form>
        <p><input v-model="email" placeholder="Email" required /></p>
        <p><input v-model="password" placeholder="Password" required type="password" /></p>
        <p>
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#loginUserModal">
            Login
          </button>
          <router-link :to="{ name: 'register'}">or Register</router-link>
        </p>
        <p><router-link :to="{ name: 'homepage'}">Continue as guest</router-link></p>
      </form>
    </div>

    <div class="modal fade" id="registerUserModal" tabindex="-1" role="dialog"
         aria-labelledby="registerUserModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerUserModalLabel">Register</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Confirm Registration?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="registerUser()">
              Confirm
            </button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="loginUserModal" tabindex="-1" role="dialog"
         aria-labelledby="loginUserModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginUserModalLabel">Logging in...</h5>
          </div>
          <div class="modal-body">
            You are being logged in...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="loginUser()">
              Okay
            </button>
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
        userImage: null,
        name: "",
        email: "",
        city: "",
        country: "",
        password: "",
        confirmedPassword: ""
      }
    },
    mounted: function() {
      this.getToken();
    },
    methods: {
      getToken: function() {
        if (localStorage.getItem("Auth_Token")) {
          this.$router.push({name: 'homepage'}).catch((err) => {});
        }
      },
      onChange(e) {
        const file = e.target.files[0];
        this.userImage = file;
      },
      loginUser: function() {
        this.$http.post( 'http://localhost:4941/api/v1/users/login', {
          "email": this.email,
          "password": this.password
        }).then((response) => {
          alert("Successfully Logged In User");
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("Auth_Token", response.data.token);
          if (this.userImage !== null) {
            this.setUserImage(response.data.userId);
          }
          this.$router.push({name: 'homepage'}).catch((err) => {});
        }).catch((error) => {
          alert("Unsuccessful Login");
          this.error = error;
          this.errorFlag = true;
        });
      },

      registerUser: function() {
        if (this.password !== this.confirmedPassword) {
          alert("The passwords you entered do not match");
        }
        else {
          var data = {
            "name": this.name,
            "email": this.email,
            "city": this.city,
            "country": this.country,
            "password": this.password
          };

          if (this.city === "") {
            data.city = undefined;
          }
          if (this.country === "") {
            data.country = undefined;
          }

          this.$http.post( 'http://localhost:4941/api/v1/users/register',
            data
          ).then((response) => {
            alert("Successfully Registered User");
            this.loginUser();
          }).catch((error) => {
            alert("Failed to register user");
            this.error = error;
            this.errorFlag = true;
            });
        }
      },
      setUserImage: function(userId) {
        var imageType = "";
        imageType += this.userImage.type;
        this.$http.put( 'http://localhost:4941/api/v1/users/' + userId + '/photo',  this.userImage,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token"), "Content-Type": imageType}
          }).then((response) => {
          alert("Successfully added profile picture");
        }).catch((error) => {
          alert("Failed to add profile picture");
          this.error = error;
          this.errorFlag = true;
        });
      }
    }
  }
</script>
