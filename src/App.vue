<script setup lang="ts">
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
    <div class="container-fluid main-navbar">
        <a class="navbar-brand" href="#">Project</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDrop" aria-controls="navbarDrop" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarDrop">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/account/login" class="nav-link">Login</router-link>
            </li>
          </ul>
          
        </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
        <div class="col py-3">
            <div class="content">
              <router-view />
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>

.main-navbar{
  max-width: 1500px;
}

</style>
