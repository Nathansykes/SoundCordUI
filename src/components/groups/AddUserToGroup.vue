<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import ApiGroupService from '@/api/services/group-service';
import { Modal } from 'bootstrap';
import ApplicationUser from '@/application-user';
import type { AxiosError } from 'axios';

const errors = ref([] as string[]);

var username: string;

onMounted(() => {
    var md = document.getElementById('addUserModal')
    const m = Modal.getOrCreateInstance(md!)
    m?.show();
});

async function addUser(event : Event){
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!validateForm(form)){
        event.stopPropagation();
        return;
    }
    try {
        const currentGroup = ApplicationUser.getCurrentGroup();
        await ApiGroupService.addUserToGroup(currentGroup!.id, username);
        emit('close', true);
    } catch (e) {
        const error = e as AxiosError;
        if(error.response?.status === 400) {
            if ((error.response?.data as any).errors) {
                errors.value = (error.response?.data as any).errors;
            } else {
                errors.value = [(error.response?.data as any).detail];
            }
        } else if (error.response?.status === 404) {
            errors.value = [(error.response?.data as any).detail];
        } else{
            errors.value = ['An error occurred, please try again later'];
        }
    }
}
const emit = defineEmits({
    close: (success: boolean) => {
        return success;
    }
})

function validateForm(form: HTMLFormElement) : boolean {
    let htmlValid = form.checkValidity();
    form.classList.add('was-validated');
    return htmlValid;
}
</script>


<template>
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserModalLabel">Add User to Group</h5>
                    <button @click="emit('close', false)" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <section class="">
                        <div class="container-fluid h-custom">
                            <div class="row d-flex justify-content-center align-items-center h-100">
                                <div class="col-md-12 justify-content-center align-items-center ">
                                    <form class="needs-validation text-center" @submit="addUser" novalidate >
                                        <div class="form-outline mb-4">
                                            <div class="form-outline mb-4">
                                                <label class="form-label" for="username" title="Username" ></label>
                                                <input v-model="username" type="username" name="username" id="username" class="form-control form-control-lg text-bg-light" placeholder="Enter a username" autocomplete="true" required  />
                                                <div class="invalid-feedback">
                                                    Please enter a username
                                                </div>  
                                            </div>
                                        </div>
                                        <div v-if="errors.length > 0">
                                            <div class=" align-content-start text-danger">
                                                <ul>
                                                    <li v-for="error in errors" :key="error">{{ error }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="text-center text-lg mt-4 pt-2">
                                            <button type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Confirm</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>