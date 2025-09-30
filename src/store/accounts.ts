import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid"; // Для уникальных идентификаторов

// TypeScript интерфейсы
export interface IAccountLabel {
  text: string;
}

export type TRecordType = "Локальная" | "LDAP";

export interface IAccount {
  id: string; // Unique ID 
  labels: IAccountLabel[];
  recordType: TRecordType;
  login: string;
  password?: string | null;
}

// Загрузка из LocalStorage (имитация backend)
const loadState = (): IAccount[] => {
  try {
    const serializedState = localStorage.getItem("accounts");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return [];
  }
};

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: loadState() as IAccount[],
  }),

  actions: {
    addAccount() {
      const newAccount: IAccount = {
        id: uuidv4(),
        labels: [],
        recordType: "Локальная",
        login: "",
        password: "",
      };
      this.accounts.push(newAccount);
    },

    /**
     * Обновление аккаунта по ID.
     * @param {IAccount} accountToUpdate - Обновленный аккаунт.
     */
    updateAccount(accountToUpdate: IAccount) {
      const index = this.accounts.findIndex(
        (acc) => acc.id === accountToUpdate.id
      );
      if (index !== -1) {
        // Убираем пароль для LDAP
        if (accountToUpdate.recordType === "LDAP") {
          accountToUpdate.password = null;
        }
        this.accounts[index] = { ...accountToUpdate };
      }
    },

    /**
     * Удаляет ааккаунт по ID.
     * @param {string} accountId - ID аккаунта для удаления.
     */
    deleteAccount(accountId: string) {
      this.accounts = this.accounts.filter((acc) => acc.id !== accountId);
    },
  },
});

export default useAccountsStore;
