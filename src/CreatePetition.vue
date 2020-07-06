<template>
  <div>
    <label><router-link :to="{ name: 'homepage'}">Back home</router-link></label>
    <h2><strong>Create a Petition:</strong></h2>
    <hr>
    <form>
      <p><input v-model="title" placeholder="Title" required /></p>
      <p><input v-model="description" placeholder="Description" required /></p>
      <div>
        <h3>Categories:</h3>
        <div v-for="category in categories">
          <input  type="radio" v-model="categoryId" v-bind:value="category.categoryId">{{category.name}}
        </div>
      </div>
      <p><strong>Hero Image: </strong><input type="file" accept="image/*" @change="onChange" /></p>
      <p>
        <label>Closing Date:</label>
        <input type="date" id="closingDate" name="closingDate" v-model="closingDate" required>
      </p>
      <button type="button" class="btn btn-primary" data-toggle="modal"
              data-target="#createPetitionModal">
        Create Petition
      </button>
    </form>

    <div class="modal fade" id="createPetitionModal" tabindex="-1" role="dialog"
         aria-labelledby="createPetitionModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createPetitionModalLabel">Create Petition</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to create this petition?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="createPetition()">
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
        title: "",
        description: "",
        categoryId: "",
        closingDate: "",
        categories: [],
        petitionId: "",
        heroImage: null
      }
    },
    mounted: function() {
      this.getToken();
      this.getCategories();
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
        this.heroImage = file;
      },
      getCategories: function() {
        this.$http.get('http://localhost:4941/api/v1/petitions/categories')
          .then((response) => {
            this.categories = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
      createPetition: function() {
        var data = {
          "title": this.title,
          "description": this.description,
          "categoryId": this.categoryId
        };

        if (this.closingDate !== "") {
          data = {
            "title": this.title,
            "description": this.description,
            "categoryId": this.categoryId,
            "closingDate": this.closingDate
          };
        }

        this.$http.post( 'http://localhost:4941/api/v1/petitions', data,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
        }).then((response) => {
          alert("Successfully created Petition");
          this.petitionId = response.data.petitionId;
          this.authorSignPetition(this.petitionId);
          this.handleFunction();
          this.$router.push({name: 'homepage'}).catch((err) => {});
        }).catch((error) => {
          alert("Failed to create Petition");
          this.error = error;
          this.errorFlag = true;
        });
      },
      setHeroImage: function() {
        var imageType = "";
        imageType += this.heroImage.type;
        this.$http.put( 'http://localhost:4941/api/v1/petitions/' + this.petitionId + '/photo',  this.heroImage,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token"), "Content-Type": imageType}
        }).then((response) => {
          alert("Successfully added hero image");
        }).catch((error) => {
          alert("Failed to add hero image");
          this.error = error;
          this.errorFlag = true;
        });
      },
      authorSignPetition: function (petitionId) {
        this.$http.post('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures', {},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          }).then((response) => {
          alert("You have now signed this petition");
        }).catch((error) => {
          alert("You cannot sign this petition");
          this.error = error;
          this.errorFlag = true;
        });
      },
      handleFunction: function() {
        this.getToken();
        this.getCategories();
        if (this.heroImage !== null) {
          this.setHeroImage();
        }
      }
    }
  }
</script>
