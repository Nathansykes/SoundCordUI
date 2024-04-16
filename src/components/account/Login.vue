<script setup lang="ts">
import router from "@/router";
import ApiAccountService from "../../api/services/account-service";
import { ref, onMounted, defineProps } from "vue";
import { useRoute } from "vue-router";

const fromRegister =  useRoute().query.fromRegister === 'true';

var username: string;
var password: string;

var errors = ref([] as string[]);

async function loginSubmit(formSubmitEvent: Event) {
  const form = formSubmitEvent.target as HTMLFormElement;
    formSubmitEvent.preventDefault();
  //check form is valid 
  if (!validateForm(form)) {
    formSubmitEvent.stopPropagation();
    return;
  }
  const result = await ApiAccountService.Login(username, password);
  if (result.success){
    window.location.href = router.resolve({name: 'Home'}).href;
  } else {
    errors.value = result.errors;
  }
}

function validateForm(form: HTMLFormElement) : boolean {
    let htmlValid = form.checkValidity();
    form.classList.add('was-validated');
    return htmlValid;
}

onMounted(() => {
});


</script>

<template>
  <div class="">
    <section class="vh-100">
      <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-md-9 col-lg-6 col-xl-5">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
          </div>
          <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 ">
            <form class="needs-validation" @submit="loginSubmit" novalidate >
                <h1>Login</h1>
                <p class="text-success" v-if="fromRegister">Registration successful, please login</p>
              <div class="form-outline mb-4">
                <label class="form-label" for="email" title="Email address" ></label>
                <input v-model="username" type="email" name="email" id="email" class="form-control form-control-lg text-bg-light" placeholder="Enter a valid email address" autocomplete="true" required  />
                <div class="invalid-feedback">
                  Please enter a valid email address
                </div>
              </div>
              <div class="form-outline mb-3">
                <label class="form-label" for="password" title="Password"></label>
                <input v-model="password" type="password" name="password" id="password" class="form-control form-control-lg text-bg-light" placeholder="Enter password" autocomplete="true" required />
                <div class="invalid-feedback">
                    Please enter a password
                  </div>
              </div>
                <div class="text-center text-danger" v-if="errors.length > 0">
                    <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </div>
              <div class="text-center text-lg-start mt-4 pt-2">
                <button type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Login</button>
                <p class="small mt-2 pt-1 mb-0">
                  Don't have an account?
                  <router-link to="/account/register">Register</router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}
.h-custom {
  height: calc(100% - 73px);
}
@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>
