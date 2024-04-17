<script setup lang="ts">
import router from "@/router";
import apiGroupService from "@/api/services/group-service";
import { ref, onMounted } from "vue";
import type { Group } from "@/api/models";
import ApplicationUser from "@/application-user";


const currentGroup = ref(ApplicationUser.getCurrentGroup());
const creatingGroup = ref(false);

var groups = ref([] as Group[]);
var selectedGroup: string;
var newGroupName: string;

onMounted(() => {
    populateGroups();
});

async function populateGroups() {
    groups.value = await apiGroupService.getGroups();
    selectedGroup = groups.value.find(g => g.id === currentGroup.value?.id)?.id ?? "";
}


async function groupSelect(formSubmitEvent: Event) {
    formSubmitEvent.preventDefault();
    const form = formSubmitEvent.target as HTMLFormElement;
    if (!validateForm(form)) {
        formSubmitEvent.stopPropagation();
        return;
    }

    var group = await apiGroupService.getGroup(selectedGroup);
    ApplicationUser.setCurrentGroup(group);
    window.location.href = router.resolve({name: 'Home'}).href;
}

async function createGroupSubmit(formSubmitEvent: Event) {
    const form = formSubmitEvent.target as HTMLFormElement;
    formSubmitEvent.preventDefault();
    if (!validateForm(form)) {
        formSubmitEvent.stopPropagation();
        return;
    }

    await apiGroupService.createGroup(newGroupName);
    closeGroup();
    populateGroups();
}

function validateForm(form: HTMLFormElement) : boolean {
    let htmlValid = form.checkValidity();
    form.classList.add('was-validated');
    return htmlValid;
}

function createGroup() {
    creatingGroup.value = true;
}

function closeGroup() {
    creatingGroup.value = false;
}

function logOut(){
    ApplicationUser.logOut();
    window.location.href = router.resolve({name: 'Login'}).href;
}

onMounted(() => {
});


</script>

<template>
    <div class="">
        <section class="">
            <div class="container-fluid h-custom">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-md-12 justify-content-center align-items-center ">
                        <div v-if="creatingGroup === false && groups.length > 0">
                            <form class="needs-validation text-center" @submit="groupSelect" novalidate >
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="groups" title="Group" ></label>
                                    <select v-model="selectedGroup" class="form-select text-bg-light" required>
                                        <option value="">Please select...</option>
                                        <option v-for="group in groups" :key="group.id" :value="group.id">{{group.groupName}}</option>
                                    </select>
                                    <div class="invalid-feedback">
                                        Please select a group
                                    </div>
                                </div>
                                <div class="text-center text-lg mt-4 pt-2">
                                    <button type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Confirm</button>
                                </div>
                            </form>
                        </div>
                        <div class="text-center text-lg mt-4 pt-2">
                            <button v-if="creatingGroup === false" @click="createGroup" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Create New Group</button>
                            <button v-if="creatingGroup === true" @click="closeGroup" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Close</button>
                        </div>
                        <div v-if="creatingGroup === true || groups.length == 0">
                            <form class="needs-validation text-center" @submit="createGroupSubmit" novalidate >
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="newGroupName" title="New Group Name" ></label>
                                    <input v-model="newGroupName" type="text" name="newGroupName" id="newGroupName" class="form-control form-control-lg text-bg-light" placeholder="New Group Name" autocomplete="true" required  />
                                </div>
                                <div class="text-center text-lg mt-4 pt-2">
                                    <button type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">Create</button>
                                </div>
                                <br />
                                <div v-if="groups.length == 0">
                                    <button class="btn btn-link" @click="logOut">Logout</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
</style>
