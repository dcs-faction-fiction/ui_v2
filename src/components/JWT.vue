<template>
  <div>
  </div>
</template>

<script>
import { getToken } from '@/lib/api_fetch.js';

export default {
  created() {
    var token = getToken();
    if (!token.token)
      window.location.replace("login.html");
  }
}
</script>

<style>
</style>
