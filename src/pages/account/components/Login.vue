<script setup lang="ts">

import ApiAccountService from '../../../services/api-service'
import {ref } from 'vue';

var username : string;
var password : string;

var loginToken = ref("");

async function loginSubmit(){
    const result = await ApiAccountService.Login(username, password);
    loginToken.value = result;
}

</script>

<template>

<div>
    <label for="username">Username</label><br />
    <input type="text" id="username" name="username" v-model="username" />
    <br />
    <label for="username">Password</label><br />
    <input type="password" id="password" name="password" v-model="password" />
    <br />
    <button type="button" @click="loginSubmit">Login</button>
</div>

<div>
    <p>{{ loginToken }}</p>
</div>
</template>

<style scoped>

</style>