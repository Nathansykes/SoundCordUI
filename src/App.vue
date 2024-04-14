<script setup lang="ts">
import router from './router';

	
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isMobile = ref(false);

onMounted(() => {
  window.addEventListener('resize', onLoadOrResizse);
  document.addEventListener('DOMContentLoaded', onLoadOrResizse); 
  window.addEventListener('load', onLoadOrResizse);
  onLoadOrResizse();
});

function onLoadOrResizse() {
  isMobile.value = window.innerWidth < 992;
  document.documentElement.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
  document.documentElement.style.setProperty('--main-content-width', "calc(100vw - (280px + var(--scrollbar-width)))");
  
  const navbarHeight = document.getElementById("main-navbar")?.offsetHeight;
  if (navbarHeight){
    document.documentElement.style.setProperty('--navbar-height',  `${navbarHeight}px`);
    document.documentElement.style.setProperty('--inner-content-height', `calc(100vh - ${navbarHeight}px)`);
  }
}

	

</script>

<template>

<div id="main-sidebar">
  <div :class="(isMobile ? 'offcanvas' : '')  +' offcanvas-start offcanvas-body d-flex flex-column flex-shrink-0 p-3 text-white bg-dark'" style="width: 280px;height: 100vh;" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="main-sidebar-offcanvas" aria-labelledby="main-sidebar-offcanvasLabel">
    <div class="align-items-center text-white text-decoration-none">
      <span class="fs-4" style="margin-top:4px">
        Group Name
        <button class="btn btn-sm d-lg-none float-end padding-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#main-sidebar-offcanvas" aria-controls="main-sidebar-offcanvas" role="button" title="Toggle Sidebar">
          <i class="bi bi-x-lg fs-5 "></i>
        </button>
      </span>
    </div>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <i>Text Channels</i>
      <li class="nav-item">
        <router-link to="/" class="nav-link text-white" aria-current="page">Channel Name</router-link>  
      </li>
      <li class="nav-item">
        <router-link to="/" class="nav-link text-white" aria-current="page">Channel Name</router-link>  
      </li>
      <hr />
      <i>Songs</i>
      <li class="nav-item">
        <router-link to="/" class="nav-link text-white" aria-current="page">Song Name</router-link>  
      </li>
    </ul>
    
    <hr>
    
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <strong>User Name</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1" style="">
        <li><a class="dropdown-item" href="#">Switch Group</a></li>
        <li><router-link to="/settings" class="dropdown-item" aria-current="page">Settings</router-link></li>
        <li><hr class="dropdown-divider"></li>
        <li><router-link to="/account/logout" class="dropdown-item" aria-current="page">Log Out</router-link></li>
      </ul>
    </div>
  </div>

</div>

<div id="main-content" style="">
  <div id="main-navbar" style="">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="d-lg-none">
          <button class="btn btn-sm " style="padding-top:0" type="button" data-bs-toggle="offcanvas" data-bs-target="#main-sidebar-offcanvas" aria-controls="main-sidebar-offcanvas" role="button" title="Toggle Sidebar">
            <i class="bi bi-list fs-5"></i>
          </button>
          <a class="navbar-brand" href="#">Navbar</a>
        </div>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Current Channel</a>
          </li>
        </ul>
        <div class="d-flex" role="search">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Navbar Link</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div id="main-inner-content">
    <router-view />
  </div>
</div>
  
  
  

</template>

<style scoped>

#main-navbar{
  display:inline-block; 
  position: fixed; 
  width: 100vw;
}

#main-content{
  display:inline-block;
  min-width: var(--main-content-width);
}

#main-sidebar{
  display:inline-block;
}

#main-inner-content{
  padding-left: 20px;
  padding-top: 10px;
  min-width: 100%;
  margin-top: var(--navbar-height);
  height: var(--inner-content-height);
}

@media (min-width: 992px) {
  #main-navbar{
    width: var(--main-content-width);
  }
  #main-content{
    margin-left: 280px;
  }
  #main-sidebar{
    position: fixed;
    top: 0;
  }
}


</style>
