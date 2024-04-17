<script setup lang="ts">
import ApiAccountService from "../../api/services/account-service";
import { ref, onMounted } from "vue";

var username: string;
var sent: Boolean;

var errors = ref([] as string[]);

async function forgotSubmit(formSubmitEvent: Event) {
    const form = formSubmitEvent.target as HTMLFormElement;
    formSubmitEvent.preventDefault();
    //check form is valid 
    if (!validateForm(form)) {
        formSubmitEvent.stopPropagation();
        return;
    }
    const result = await ApiAccountService.ForgotPassword(username);
    if (result.success){
        sent=true;
        errors.value = []; 
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
                        <form class="needs-validation" @submit="forgotSubmit" novalidate >
                            <h1>Forgot Password</h1>
                            <p>
                                If the username exists and has a valid email, you will receive an email containing a link to reset your password.<br />
                                Please make sure to check your junk mail folder if you do not receive the email.
                            </p>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="username" title="Username" ></label>
                                <input v-model="username" type="text" name="username" id="username" class="form-control form-control-lg text-bg-light" placeholder="Enter a username" autocomplete="true" required  />
                            </div>
                            <div class="text-center text-danger" v-if="errors.length > 0">
                                <ul>
                                    <li v-for="error in errors" :key="error">{{ error }}</li>
                                </ul>
                            </div>
                            <div class="text-center text-lg-start mt-4 pt-2">
                                <button :disabled="sent === true" type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Send email</button>
                            </div>
                            <p class="small mt-2 pt-1 mb-0">
                                <router-link to="/account/login">Back to Login</router-link>
                            </p>
                            <p v-if="sent == true">A password reset has been sent to your email</p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>

</style>
