<template>
  <div>
    <label><router-link :to="{ name: 'homepage'}">Back home</router-link></label>
    <h2><strong>My Profile:</strong></h2>
    <hr>
    <div id="userInfo">
      <img :src="getUserImage()"  onerror="src='https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png'" height="100">
      <button type="button" class="btn btn-primary" data-toggle="modal"
            v-on:click="deleteUserImage()">
        Remove
      </button>
      <p><strong>Name: </strong> {{userInfo.name}}</p>
      <p><strong>Email: </strong> {{userInfo.email}}</p>
      <div v-if="userInfo.city">
        <p><strong>City: </strong>{{userInfo.city}}</p>
      </div>
      <div v-if="userInfo.country">
        <p><strong>Country: </strong>{{userInfo.country}}</p>
      </div>
      <button type="button" class="btn btn-primary" data-toggle="modal"
              data-target="#editNameModal" v-on:click="getAllDetails()">
        Edit Details
      </button>
    </div>

    <div class="modal fade" id="editNameModal" tabindex="-1" role="dialog"
         aria-labelledby="editNameModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editNameModalLabel">Edit Name</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <p><strong>Profile Picture: </strong><input type="file" accept="image/*" @change="onChange" /></p>
              <strong>Name: </strong>
              <p><input v-model="currentName" placeholder="Name" required /></p>
              <strong>Email: </strong>
              <p><input v-model="currentEmail" placeholder="Email" required /></p>
              <strong>City: </strong>
              <p><input v-model="currentCity" placeholder="City" /></p>
              <strong>Country: </strong>
              <p><input v-model="currentCountry" placeholder="Country" /></p>
              <strong>Current Password: </strong>
              <p><input v-model="currentPassword" placeholder="Current Password" required type="password" /></p>
              <strong>New Password: </strong>
              <p><input v-model="newPassword" placeholder="New Password" required type="password"/></p>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="editAllDetails()">
              Confirm
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
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
        userInfo: [],
        userId: "",
        userImage: null,
        currentName: "",
        currentEmail: "",
        currentCity: "",
        currentCountry: "",
        currentPassword: "",
        newPassword: ""
      }
    },
    mounted: function() {
      this.getToken();
      this.getUserInfo();
    },
    methods: {
      getToken: function() {
        if (!(localStorage.getItem("Auth_Token"))) {
          alert("You need to be logged in to view this page");
          this.$router.push({name: 'login'}).catch((err) => {});
        }
      },
      onChange(e) {
        const file = e.target.files[0];
        this.userImage = file;
      },
      getUserInfo: function () {
        this.userId = localStorage.getItem("userId");
        this.$http.get('http://localhost:4941/api/v1/users/' + this.userId,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          }).then((response) => {
            this.userInfo = response.data;
          }).catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getUserImage: function() {
        return 'http://localhost:4941/api/v1/users/' + this.userId + '/photo';
      },
      getAllDetails: function() {
        this.currentName = this.userInfo.name;
        this.currentEmail = this.userInfo.email;
        this.currentCity = this.userInfo.city;
        this.currentCountry = this.userInfo.country;
      },
      editAllDetails: function() {
        var data = {
          name: this.currentName,
          email: this.currentEmail,
          password: this.newPassword,
          currentPassword: this.currentPassword,
          city: this.currentCity,
          country: this.currentCountry
        };

        if (this.currentName === "") {
          data.name = undefined;
        }
        if (this.currentEmail === "") {
          data.email = undefined;
        }
        if (this.currentCity === "" || this.currentCity === null) {
          data.city = undefined;
        }
        if (this.currentCountry === "" || this.currentCountry === null) {
          data.country = undefined;
        }
        if (this.newPassword === "") {
          data.password = undefined;
        }
        if (this.currentPassword === "") {
          data.currentPassword = undefined;
        }

        this.$http.patch('http://localhost:4941/api/v1/users/' + this.userId,
          data,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          })
          .then((response) => {
            alert("Successfully edited user details")
            if (this.userImage !== null) {
              this.setUserImage();
            } else {
              location.reload();
            }
          })
          .catch((error) => {
            alert("Error when editing user");
            this.error = error;
            this.errorFlag = true;
          });
        this.handleFunction();
      },
      setUserImage: function() {
        var imageType = "";
        imageType += this.userImage.type;
        this.$http.put( 'http://localhost:4941/api/v1/users/' + this.userId + '/photo',  this.userImage,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token"), "Content-Type": imageType}
          }).then((response) => {
          alert("Successfully added profile picture");
          this.handleFunction();
          location.reload();
        }).catch((error) => {
          alert("Failed to add profile picture");
          this.error = error;
          this.errorFlag = true;
        });
      },
      deleteUserImage: function() {
        this.$http.delete( 'http://localhost:4941/api/v1/users/' + this.userId + '/photo',
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          }).then((response) => {
          alert("Successfully removed profile picture");
          this.handleFunction();
          location.reload();
        }).catch((error) => {
          alert("You do not have a profile picture");
          this.error = error;
          this.errorFlag = true;
        });
      },
      handleFunction: function() {
        this.getToken();
        this.getUserInfo();
        this.currentPassword = "";
        this.newPassword = ""
      }
    }
  }
</script>
