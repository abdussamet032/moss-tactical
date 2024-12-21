<script setup>
definePageMeta({
    middleware: ['auth']
})

const user = useSupabaseUser()
</script>

<template>
    <div>
        <h1>Profil Sayfası</h1>
        <p>Email: {{ user?.email }}</p>
    </div>
</template>