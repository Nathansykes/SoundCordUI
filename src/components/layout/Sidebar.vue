<script setup lang="ts">
import store from '../../store';

</script>

<template>
    <div id="main-sidebar">
        <div :class="(store.isMobile ? 'offcanvas' : '')  +' offcanvas-start offcanvas-body d-flex flex-column flex-shrink-0 p-3 text-white bg-dark'" style="width: 280px;height: 100vh;" tabindex="-1" id="main-sidebar-offcanvas" aria-labelledby="main-sidebar-offcanvasLabel">
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
</template>