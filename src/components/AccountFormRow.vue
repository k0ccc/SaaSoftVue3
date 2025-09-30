<template>
  <v-row align="center">
    <v-col cols="12" md="3">
       <v-text-field
        v-model="labelsAsString"
        label="Метки"
        variant="outlined"
        density="compact"
        :maxlength="50"
        @blur="handleUpdate"
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="2">
       <v-select
        v-model="localAccount.recordType"
        :items="recordTypes"
        label="Тип записи"
        variant="outlined"
        density="compact"
        @update:modelValue="handleUpdate"
      ></v-select>
    </v-col>

    <v-col cols="12" md="3">
       <v-text-field
        v-model="localAccount.login"
        label="Логин"
        variant="outlined"
        density="compact"
        :error-messages="errors.login"
        :maxlength="100"
        @blur="handleUpdate"
      ></v-text-field>
    </v-col>
    
    <v-col cols="12" md="3">
        <v-text-field
            v-if="localAccount.recordType === 'Локальная'"
            v-model="localAccount.password"
            label="Пароль"
            :type="passwordVisible ? 'text' : 'password'"
            :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            density="compact"
            :error-messages="errors.password"
            :maxlength="100"
            @click:append-inner="passwordVisible = !passwordVisible"
            @blur="handleUpdate"
        ></v-text-field>
    </v-col>

    <v-col cols="12" md="1" class="text-right" style="height: 86px;">
       <v-btn icon="mdi-delete" variant="text" @click="accountsStore.deleteAccount(localAccount.id)"></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useAccountsStore, type IAccount, type TRecordType } from '../store/accounts';

const props = defineProps<{
  account: IAccount;
}>();

const accountsStore = useAccountsStore();

// Создаем копию пропса аккаунта для изменения.
const localAccount = reactive<IAccount>({ ...props.account });

const passwordVisible = ref(false);
const recordTypes: TRecordType[] = ['Локальная', 'LDAP'];
const errors = reactive({
    login: '',
    password: ''
});

// Обновляем локальное состояние по необходимости
watch(() => props.account, (newVal) => {
    Object.assign(localAccount, newVal);
}, { deep: true });


// Computed Трансформирование меток в строку
const labelsAsString = computed({
  get: () => localAccount.labels.map(label => label.text).join('; '),
  set: (newValue: string) => {
    localAccount.labels = newValue
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(text => ({ text }));
  }
});

/**
 * Валидация полей.
 * Возвращает true, если все поля валидны.
 */
const validate = (): boolean => {
    errors.login = '';
    errors.password = '';
    let isValid = true;

    // Необходим логин 
    if (!localAccount.login || localAccount.login.trim() === '') {
        errors.login = 'Логин обязателен для заполнения.';
        isValid = false;
    }

    // Пароль обязателен только для 'локальная'
    if (localAccount.recordType === 'Локальная' && (!localAccount.password || localAccount.password.trim() === '')) {
        errors.password = 'Пароль обязателен для заполнения.';
        isValid = false;
    }

    return isValid;
};

/**
 * Валидация и сохранение аккаунта. 
 */
const handleUpdate = () => {
    if (validate()) {
        // If valid, save/update the account in the store 
        accountsStore.updateAccount({ ...localAccount });
    }
};

</script>