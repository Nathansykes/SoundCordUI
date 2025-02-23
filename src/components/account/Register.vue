<script setup lang="ts">
import router from "@/router";
import ApiAccountService from "../../api/services/account-service";
import { ref, onMounted } from "vue";


var username: string;
var email: string;
var password: string;
var confirmpassword: string;

var errors = ref([] as string[]);
var loading = ref(false);

async function registerSubmit(formSubmitEvent: Event) {
    const form = formSubmitEvent.target as HTMLFormElement;
    formSubmitEvent.preventDefault();
    //check form is valid 
    if (!validateForm(form)){
    
        formSubmitEvent.stopPropagation();
        return;
    }
    loading.value=true;
    const result = await ApiAccountService.Register(username, email, password);
    if(result.success){
        router.push({name: 'Login', query: { state: 'fromRegister'} });
    } else {
        errors.value = result.errors;
    }
    loading.value=false;
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
    const form = document.getElementById('registerForm') as HTMLFormElement;
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
                        <form id="registerForm" class="needs-validation" @submit="registerSubmit" novalidate >
                            <h1>Register</h1>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="username" title="Username" ></label>
                                <input v-model="username" type="text" name="username" id="username" class="form-control form-control-lg text-bg-light no-obfuscate" placeholder="Enter a unique username" autocomplete="true" required  />
                            </div>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="email" title="Email address" ></label>
                                <input v-model="email" type="email" name="email" id="email" class="form-control form-control-lg text-bg-light no-obfuscate" placeholder="Enter a valid email address" autocomplete="true" required  />
                                <div class="invalid-feedback">
                                    Please enter a valid email address
                                </div>
                            </div>
                            <div class="form-outline mb-3">
                                <label class="form-label" for="password" title="Password"></label>
                                <input v-model="password" type="password" name="password" id="password" class="form-control form-control-lg text-bg-light no-obfuscate" pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$"  placeholder="Enter password" autocomplete="true" required />
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
                                <input v-model="confirmpassword" type="password" name="confirmpassword" id="confirmpassword" class="form-control form-control-lg text-bg-light no-obfuscate" placeholder="Enter password again" autocomplete="true" required />
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
                                <i>By registering you confirm you have read and agree to the <a target="_blank" href="/participant_information_sheet.pdf">Participant Information Sheet</a></i><br>
                                <button :disabled="loading === true" type="submit" class="btn btn-primary btn-lg no-obfuscate" style="padding-left: 2.5rem; padding-right: 2.5rem">Register <span v-if="loading === true" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>
                                <p class="small mt-2 pt-1 mb-0">
                                    Already have an account?
                                    <router-link to="/account/login">Login</router-link>
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
