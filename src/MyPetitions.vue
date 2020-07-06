<template>
  <div>
    <div v-if="$route.params.petitionId">
      <label><router-link :to="{ name: 'homepage'}">Back Home</router-link></label>
      <label><router-link :to="{ name: 'my petitions'}">View My Petitions</router-link></label>
      <div id="onePetition">
        <p>
          <strong>{{singlePetition.title}}</strong>
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editTitleModal" v-on:click="getCurrentTitle()">
            Edit
          </button></p>
        <p><img :src="getPetitionImage($route.params.petitionId)"
             onerror="src='https://disinherited.com/wp-content/uploads/2020/03/petition2-1024x690.png'"
             height="200">
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editHeroImageModal">
            Edit
          </button>
        </p>
        <p>
          <strong>Category: </strong> {{singlePetition.category}}
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editCategoryModal" v-on:click="getCurrentCategory()">
            Edit
          </button>
        </p>
        <p>
          <strong>Description: </strong>{{singlePetition.description}}
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editDescriptionModal" v-on:click="getCurrentDescription()">
            Edit
          </button>
        </p>
        <p><strong>Created Date: </strong>{{singlePetition.createdDate}}</p>
        <p>
          <strong>Closing Date: </strong>{{singlePetition.closingDate}}
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editClosingDateModal" v-on:click="getCurrentClosingDate()">
            Edit
          </button>
        </p>
      </div>
    </div>

    <div v-else>
      <label><router-link :to="{ name: 'homepage'}">Back Home</router-link></label>
      <h2><strong>My Petitions:</strong></h2>
      <hr>
      <div v-if="myPetitions.length === 0">
        <h2>You Have No Petitions</h2>
      </div>
      <div v-for="petition in myPetitions">
        <p>
          <strong>{{petition.title}}</strong>
          <router-link :to="{name: 'my one petition', params: { petitionId: petition.petitionId }}" @click.native="handleFunction()"><button>Edit Petition</button></router-link>
          <button type = button v-on:click="deletePetition(petition.petitionId)">Delete Petition</button>
        </p>
        <img :src="getPetitionImage(petition.petitionId)"
             onerror="src='https://disinherited.com/wp-content/uploads/2020/03/petition2-1024x690.png'"
             height="200">
        <p><strong>Category: </strong> {{petition.category}}</p>
        <p><strong>Author: </strong> {{petition.authorName}}</p>
        <p><strong>Signatures: </strong> {{petition.signatureCount}}</p>
        <br>
      </div>
    </div>

    <div class="modal fade" id="editTitleModal" tabindex="-1" role="dialog"
         aria-labelledby="editTitleModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editTitleModalLabel">Edit Title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <p><input v-model="currentTitle" placeholder="Title" required /></p>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="editTitle($route.params.petitionId)">
              Confirm
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editHeroImageModal" tabindex="-1" role="dialog"
         aria-labelledby="editHeroImageModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editHeroImageModalLabel">Edit Hero Image</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p><strong>Hero Image: </strong><input type="file" accept="image/*" @change="onChange" /></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="editHeroImage($route.params.petitionId)">
              Confirm
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editCategoryModal" tabindex="-1" role="dialog"
         aria-labelledby="editCategoryModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editCategoryModalLabel">Edit Category</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <h3>Categories:</h3>
              <div v-for="category in categories">
                <input  type="radio" v-model="currentCategoryId" v-bind:value="category.categoryId">{{category.name}}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="editCategory($route.params.petitionId)">
              Confirm
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editDescriptionModal" tabindex="-1" role="dialog"
         aria-labelledby="editDescriptionModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editDescriptionModalLabel">Edit Description</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <p><input v-model="currentDescription" placeholder="Description" required /></p>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="editDescription($route.params.petitionId)">
              Confirm
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editClosingDateModal" tabindex="-1" role="dialog"
         aria-labelledby="editClosingDateModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editClosingDateModalLabel">Edit Closing Date</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>
              <label>Closing Date:</label>
              <input type="date" id="closingDate" name="closingDate" v-model="currentClosingDate" required>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="editClosingDate($route.params.petitionId)">
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
        myPetitions: [],
        singlePetition: [],
        categories: [],
        currentTitle: "",
        currentCategoryId: "",
        currentDescription: "",
        currentClosingDate: "",
        heroImage: null
      }
    },
    mounted: function() {
      this.getToken();
      this.getMyPetitions();
      this.getCategories();
      if (this.$route.params.petitionId !== undefined) {
        this.getOnePetition(this.$route.params.petitionId);
        this.getCategories();
        this.getCurrentCategory();
      }
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
      getCurrentTitle: function() {
        this.currentTitle = this.singlePetition.title;
      },
      getCurrentCategory: function() {
        for(var i = 0; i < this.categories.length; i++) {
          if (this.categories[i].name === this.singlePetition.category) {
            this.currentCategoryId = i + 1;
            break;
          }
        }
      },
      getCurrentDescription: function() {
        this.currentDescription = this.singlePetition.description;
      },
      getCurrentClosingDate: function() {
        this.currentClosingDate = this.singlePetition.closingDate;
      },
      editTitle: function(petitionId) {
        this.$http.patch('http://localhost:4941/api/v1/petitions/' + petitionId, {title: this.currentTitle},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          })
          .then((response) => {
            alert("Successfully edited title");
            this.handleFunction();
          })
          .catch((error) => {
            alert("Failed to edited title");
            this.error = error;
            this.errorFlag = true;
          });
      },
      editHeroImage: function(petitionId) {
        var imageType = "";
        imageType += this.heroImage.type;
        this.$http.put( 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo',  this.heroImage,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token"), "Content-Type": imageType}
          }).then((response) => {
          alert("Successfully edited hero image");
          this.handleFunction();
          location.reload();
        }).catch((error) => {
          alert("Failed to edit hero image");
          this.error = error;
          this.errorFlag = true;
        });
      },
      editCategory: function(petitionId) {
        this.$http.patch('http://localhost:4941/api/v1/petitions/' + petitionId, {categoryId: this.currentCategoryId},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          })
          .then((response) => {
            alert("Successfully edited category");
            this.handleFunction();
          })
          .catch((error) => {
            alert("Failed to edit category");
            this.error = error;
            this.errorFlag = true;
          });
      },
      editDescription: function(petitionId) {
        this.$http.patch('http://localhost:4941/api/v1/petitions/' + petitionId, {description: this.currentDescription},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          })
          .then((response) => {
            alert("Successfully edited description");
            this.handleFunction();
          })
          .catch((error) => {
            alert("Failed to edit description");
            this.error = error;
            this.errorFlag = true;
          });
      },
      editClosingDate: function(petitionId) {
        this.$http.patch('http://localhost:4941/api/v1/petitions/' + petitionId, {closingDate: this.currentClosingDate},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          })
          .then((response) => {
            alert("Successfully edited closing date");
            this.handleFunction();
          })
          .catch((error) => {
            alert("Closing date must be in the future");
            this.error = error;
            this.errorFlag = true;
          });
      },
      deletePetition: function(petitionId) {
        this.$http.delete('http://localhost:4941/api/v1/petitions/' + petitionId,
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          })
          .then((response) => {
            alert("Successfully deleted petition");
            this.handleFunction();
          })
          .catch((error) => {
            alert("Failed to delete petition");
            this.error = error;
            this.errorFlag = true;
          });
      },
      getMyPetitions: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions?authorId=' + localStorage.getItem("userId"))
        .then((response) => {
          this.myPetitions = response.data;
        })
        .catch((error) => {
          this.error = error;
          this.errorFlag = true;
        });
      },

      getOnePetition: function (petitionId) {
        this.$http.get('http://localhost:4941/api/v1/petitions/' + petitionId)
          .then((response) => {
            this.singlePetition = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getPetitionImage: function(petitionId) {
        return 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo';
      },

      handleFunction: function() {
        this.getMyPetitions();
        this.getOnePetition(this.$route.params.petitionId);
        this.getCurrentCategory();
      }
    }
  }
</script>
