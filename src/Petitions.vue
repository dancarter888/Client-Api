<template>
  <div>
    <div v-if="$route.params.petitionId">
      <label><router-link :to="{ name: 'homepage'}">Back Home</router-link></label>
      <label><router-link :to="{ name: 'petitions'}">View Petitions</router-link></label>
      <div v-if="loginFlag == true">
        <button type="button" class="btn btn-primary" v-on:click="signPetition($route.params.petitionId)">
          Sign Petition
        </button>
        <button type="button" class="btn btn-primary" v-on:click="deleteSignature($route.params.petitionId)">
          Delete Signature
        </button>
      </div>
      <div id="onePetition">
        <p><strong>{{singlePetition.title}}</strong></p>
        <img :src="getPetitionImage($route.params.petitionId)"
             onerror="src='https://disinherited.com/wp-content/uploads/2020/03/petition2-1024x690.png'"
             height="200">
        <p><strong>Category: </strong> {{singlePetition.category}}</p>
        <p><strong>Description: </strong>{{singlePetition.description}}</p>
        <img :src="getUserImage(singlePetition.authorId)" onerror="src='https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png'" height="100">
        <p><strong>Author: </strong> {{singlePetition.authorName}}</p>
        <div v-if="singlePetition.authorCity">
          <p><strong>City: </strong>{{singlePetition.authorCity}}</p>
        </div>
        <div v-if="singlePetition.authorCountry">
          <p><strong>Country: </strong>{{singlePetition.authorCountry}}</p>
        </div>
        <br>
        <p><strong>Created Date: </strong>{{singlePetition.createdDate}}</p>
        <div v-if="singlePetition.closingDate == undefined">
          <p><strong>Closing Date: </strong>NOT SET</p>
        </div>
        <div v-else>
          <p><strong>Closing Date: </strong>{{singlePetition.closingDate}}</p>
        </div>

        <br>
        <div v-if="!singlePetition.signatureCount">
          <p><strong>Signatures: </strong> 0</p>
        </div>
        <div v-else>
          <p><strong>Signatures: </strong> {{singlePetition.signatureCount}}</p>
        </div>
        <div id="signatures">
          <div v-for="signature in signatures">
            <hr>
            <img :src="getUserImage(signature.signatoryId)" onerror="src='https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png'" height="100">
            <p><strong>Name: </strong>{{signature.name}}</p>
            <div v-if="signature.city">
              <p><strong>City: </strong>{{signature.city}}</p>
            </div>
            <div v-if="signature.country">
              <p><strong>Country: </strong>{{signature.country}}</p>
            </div>
          </div>
        </div>
        <div>
          <br/>
          <strong>Share:</strong>
          <strong><a href="https://www.facebook.com/">Facebook</a></strong>
          <strong><a href="https://www.twitter.com/">Twitter</a></strong>
          <strong><a href="https://www.instagram.com/">Instagram</a></strong>
        </div>
      </div>

    </div>

    <div v-else>
      <div id="petitions">
        <label><router-link :to="{ name: 'homepage'}">Back Home</router-link></label>
        <div id="navigation">
          <div v-if="((startIndex + 1) >= lastIndex) && lastIndex >= 10">
            <button type="button" v-on:click="setStartIndex(0)"><< First</button>
            <button type="button" v-on:click="setStartIndex(startIndex - 10)">< Prev></button>
            Page {{(startIndex + 10) / 10}} of {{(lastIndex + 10) / 10}}
          </div>

          <div v-else-if="(startIndex + 10) / 10 !== 1">
            <button type="button" v-on:click="setStartIndex(0)"><< First</button>
            <button type="button" v-on:click="setStartIndex(startIndex - 10)">< Prev></button>
            Page {{(startIndex + 10) / 10}} of {{(lastIndex + 10) / 10}}
            <button type="button" v-on:click="setStartIndex(startIndex + 10)">Next ></button>
            <button type="button" v-on:click="setStartIndex(lastIndex)">Last >></button>
          </div>

          <div v-else-if="lastIndex >= 10">
            Page {{(startIndex + 10) / 10}} of {{(lastIndex + 10) / 10}}
            <button type="button" v-on:click="setStartIndex(startIndex + 10)">Next ></button>
            <button type="button" v-on:click="setStartIndex(lastIndex)">Last >></button>
          </div>

          <div v-else>
            Page {{(startIndex + 10) / 10}} of {{(lastIndex + 10) / 10}}
          </div>
        </div>

        <p/>

        <div id="searchbar">
          <form>
            <input v-model="searchTerm" placeholder="Search"/>
            <button type="button" v-on:click="setSearchTerm()">Search</button>
          </form>
        </div>

        <div id="filter">
          <form>
            <div>
              <h3>Filter:</h3>
              <input  type="radio" v-model="categoryId" v-bind:value="''" v-on:change="setCategoryId(true)">No Filter
              <div v-for="category in categories">
                <input  type="radio" v-model="categoryId" v-bind:value="category.categoryId" v-on:change="setCategoryId(false)">{{category.name}}
              </div>
            </div>
          </form>
        </div>

        <div id="sort">
          <form>
            <div>
              <h3>Sort by:</h3>
              <input  type="radio" v-model="sortBy" v-bind:value="''" v-on:change="setSortBy(true)">No Sort
              <div v-for="sortTerm in sortTerms">
                <input  type="radio" v-model="sortBy" v-bind:value="sortTerm.value" v-on:change="setSortBy(false)">{{sortTerm.title}}
              </div>
            </div>
          </form>
        </div>

        <br/>

        <div v-for="petition in petitions">
          <p>
            <strong>{{petition.title}}</strong>
            <router-link :to="{name: 'one petition', params: { petitionId: petition.petitionId }}" @click.native="handleFunction()">View petition</router-link>
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
    </div>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        allPetitions: [],
        totalNumPetitions: 0,
        lastIndex: 0,
        petitions: [],
        singlePetition: [],
        signatures: [],
        categories: [],
        sortTerms: [{title: "A-Z", value: "ALPHABETICAL_ASC"}, {title: "Z-A", value: "ALPHABETICAL_DESC"},
                    {title: "Signatures Ascending", value: "SIGNATURES_ASC"}, {title: "Signatures Descending", value: "SIGNATURES_DESC"}],
        loginFlag: false,
        searchTerm: "",
        modSearchTerm: "",
        categoryId: "",
        modCategoryId: "",
        sortBy: "",
        modSortBy: "",
        modCount: "&count=10",
        startIndex: 0,
        modStartIndex: ""
      }
    },
    mounted: function () {
      this.getPetitions();
      this.getCategories();
      this.getAllPetitions();
      if (this.$route.params.petitionId !== undefined) {
        this.getOnePetition(this.$route.params.petitionId);
        this.getSignatures(this.$route.params.petitionId);
        this.checkLogin();
      }
    },
    methods: {
      getPetitions: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions?' + this.modSearchTerm + this.modCategoryId + this.modSortBy + this.modCount + this.modStartIndex)
          .then((response) => {
            this.petitions = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getAllPetitions: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions?count=500'+ this.modSearchTerm + this.modCategoryId + this.modSortBy)
          .then((response) => {
            this.allPetitions = response.data;
            this.totalNumPetitions = this. allPetitions.length;
            this.lastIndex = (this.totalNumPetitions-1) - ((this.totalNumPetitions-1) % 10);
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      setSearchTerm: function() {
        if (this.searchTerm !== "") {
          this.modSearchTerm = "&q=" + this.searchTerm;
        } else {
          this.modSearchTerm = "";
        }
        this.getPetitions();
        this.getAllPetitions();
        this.setStartIndex(0);
      },

      setCategoryId: function(clear) {
        if (this.categoryId !== "" && clear === false) {
          this.modCategoryId = "&categoryId=" + this.categoryId;
        } else {
          this.modCategoryId = "";
        }
        this.getPetitions();
        this.getAllPetitions();
        this.setStartIndex(0);
      },

      setSortBy: function(clear) {
        if (this.sortBy !== "" && clear === false) {
          this.modSortBy = "&sortBy=" + this.sortBy;
        } else {
          this.modSortBy = "";
        }
        this.getPetitions();
        this.getAllPetitions();
        this.setStartIndex(0);
      },

      setStartIndex: function(startIndex) {
        this.startIndex = startIndex;
        if (this.startIndex !== 0) {
          this.modStartIndex = "&startIndex=" + this.startIndex;
        } else {
          this.modStartIndex = "";
        }
        this.getPetitions();
        this.getAllPetitions();
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

      getPetitionImage: function(petitionId) {
        return 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo';
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

      getSignatures: function (petitionId) {
        this.$http.get('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures')
          .then((response) => {
            this.signatures = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getUserImage: function(authorId) {
        return 'http://localhost:4941/api/v1/users/' + authorId + '/photo';
      },

      signPetition: function (petitionId) {
        this.$http.post('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures', {},
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
        }).then((response) => {
            alert("You have now signed this petition");
            this.handleFunction();
        }).catch((error) => {
            alert("You cannot sign this petition");
            this.error = error;
            this.errorFlag = true;
          });
      },

      deleteSignature: function (petitionId) {
        this.$http.delete('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures',
          {headers: {"X-Authorization": localStorage.getItem("Auth_Token")}
          }).then((response) => {
          alert("You have deleted your signature");
          this.handleFunction();
        }).catch((error) => {
          alert("You cannot delete your signature from this petition");
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

      handleFunction: function() {
        this.getPetitions();
        this.getAllPetitions();
        this.getOnePetition(this.$route.params.petitionId);
        this.getSignatures(this.$route.params.petitionId);
        this.checkLogin();

      }
    }
  }
</script>
