<script setup lang="ts">
import router from "@/router";
import ApiAccountService from "../../api/services/account-service";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";


const username =  useRoute().query.username?.valueOf() as string;
const token =  (useRoute().query.token?.valueOf() as string);

var password: string;
var confirmpassword: string;

var errors = ref([] as string[]);

async function resetSubmit(formSubmitEvent: Event) {
    const form = formSubmitEvent.target as HTMLFormElement;
    formSubmitEvent.preventDefault();
    //check form is valid 
    if (!validateForm(form)){
    
        formSubmitEvent.stopPropagation();
        return;
    }
    const result = await ApiAccountService.ResetPassword(username, token, password);
    if(result.success){
        router.push({name: 'Login', query: { state: 'reset'} });
    } else {
        errors.value = result.errors;
    }
}

function validateForm(form: HTMLFormElement) : boolean {
    let htmlValid = form.checkValidity();


    const confirmpasswordInput = form.querySelector("#confirmpassword") as HTMLInputElement;

    if(password !== confirmpassword) {
        htmlValid = false;
        confirmpasswordInput.classList.add('is-invalid');
        confirmpasswordInput.setCustomValidity('Password must match');
    }
    else {
        confirmpasswordInput.classList.remove('is-invalid');
        confirmpasswordInput.setCustomValidity('');
    }
    form.classList.add('was-validated');
    return htmlValid;
}

onMounted(() => {
    const form = document.getElementById('resetForm') as HTMLFormElement;
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            var inputsCurrent = form.querySelectorAll('input');
            if(!isAnyEmpty(inputsCurrent)) {
                validateForm(form);
            }
        });
    });
});

function isAnyEmpty(inputs: NodeListOf<HTMLInputElement>) {
    for (const input of inputs){
        if (input.value === '') {
            return true
        }
    }
    return false;
}
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
                        <form id="resetForm" class="needs-validation" @submit="resetSubmit" novalidate >
                            <h1>Reset Password</h1>
                            <div class="form-outline mb-3">
                                <label class="form-label" for="password" title="Password"></label>
                                <input v-model="password" type="password" name="password" id="password" class="form-control form-control-lg text-bg-light" pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$"  placeholder="Enter new password" autocomplete="true" required />
                                <div class="invalid-feedback">
                                    Please enter a valid password, must contain:<br />
                                    <ul>
                                        <li>At least one lowercase letter</li>
                                        <li>At least one uppercase letter</li>
                                        <li>At least one number</li>
                                        <li>At least one special character</li>
                                        <li>Minimum of 6 characters</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="form-outline mb-3">
                                <label class="form-label" for="confirmpassword" title="Confirm Password"></label>
                                <input v-model="confirmpassword" type="password" name="confirmpassword" id="confirmpassword" class="form-control form-control-lg text-bg-light" placeholder="Enter password again" autocomplete="true" required />
                                <div class="invalid-feedback">
                                    Password must match
                                </div>
                            </div>
                            <div class="text-center text-danger" v-if="errors.length > 0">
                                <ul>
                                    <li v-for="error in errors" :key="error">{{ error }}</li>
                                </ul>
                            </div>
                            <div class="text-center text-lg-start mt-4 pt-2">
                                <button type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Reset</button>
                                <p class="small mt-2 pt-1 mb-0">
                                    <router-link to="/account/login">Back to Login</router-link>
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
