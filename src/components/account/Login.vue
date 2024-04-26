<script setup lang="ts">
import router from "@/router";
import ApiAccountService from "../../api/services/account-service";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const state =  useRoute().query.state;

var username: string;
var password: string;

var errors = ref([] as string[]);
var loading = ref(false);

async function loginSubmit(formSubmitEvent: Event) {
    const form = formSubmitEvent.target as HTMLFormElement;
    formSubmitEvent.preventDefault();
    //check form is valid 
    if (!validateForm(form)) {
        formSubmitEvent.stopPropagation();
        return;
    }
    loading.value=true;
    const result = await ApiAccountService.Login(username, password);
    if (result.success){
        window.location.href = router.resolve({name: 'Home'}).href;
    } else {
        errors.value = result.errors;
    }
    loading.value=false;
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
                    <div class="col-md-9 col-lg-6 col-xl-5 text-center">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
                        <a class="" target="_blank" href="/guides_and_tutorials.pdf">Guides and Tutorials</a>
                    </div>
                    <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 ">
                        <form class="needs-validation" @submit="loginSubmit" novalidate >
                            <h1>Login</h1>
                            <p class="text-success" v-if="state=='fromRegister'">Registration successful, please login</p>
                            <p class="text-success" v-else-if="state=='expired'">Session expired, please login again</p>
                            <p class="text-success" v-else-if="state=='reset'">Password reset sucessful, please login again</p>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="username" title="Username" ></label>
                                <input v-model="username" type="text" name="username" id="username" class="form-control form-control-lg text-bg-light no-obfuscate" placeholder="Enter a username" autocomplete="true" required  />
                            </div>
                            <div class="form-outline mb-3">
                                <label class="form-label" for="password" title="Password"></label>
                                <input v-model="password" type="password" name="password" id="password" class="form-control form-control-lg text-bg-light no-obfuscate" placeholder="Enter password" autocomplete="true" required />
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
                                <button :disabled="loading === true" type="submit" class="btn btn-primary btn-lg no-obfuscate" style="padding-left: 2.5rem; padding-right: 2.5rem">Login <span v-if="loading === true" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>
                                <p class="small mt-2 pt-1 mb-0">
                                    Don't have an account?
                                    <router-link to="/account/register">Register </router-link>
                                </p>
                                <p class="small mt-2 pt-1 mb-0">
                                    <router-link to="/account/forgotpassword">Reset Password</router-link>
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
</style>
