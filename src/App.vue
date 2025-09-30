<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align="center" class="mb-4">
          <v-col cols="auto">
            <h1 class="text-h4">Учетные записи</h1>
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-plus" size="small" @click="accountsStore.addAccount"></v-btn>
          </v-col>
        </v-row>

        <v-alert
          type="info"
          variant="tonal"
          class="mb-6"
          icon="mdi-information-outline"
          text="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
        ></v-alert>
        
        <v-row class="font-weight-bold mb-2 d-none d-md-flex">
            <v-col md="3">Метки</v-col>
            <v-col md="2">Тип записи</v-col>
            <v-col md="3">Логин</v-col>
            <v-col md="3">Пароль</v-col>
            <v-col md="1"></v-col>
          </v-row>

        <account-form-row
          v-for="account in accounts"
          :key="account.id"
          :account="account"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountsStore } from './store/accounts';
import AccountFormRow from './components/AccountFormRow.vue';

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
</script>

<style>
/* Optional: Global styles for better spacing */
.v-main {
  background-color: #f7f8fc;
}
</style>