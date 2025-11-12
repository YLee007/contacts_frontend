/**
 * 联系人状态管理 Store
 * 使用 Zustand 进行状态管理
 */

import { create } from 'zustand';
import { Contact, ContactCreate, ContactUpdate, ContactQueryParams } from '../types/contact';
import { contactApi } from '../services/contactApi';

interface ContactState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  selectedTags: string[]; // 添加 selectedTags 状态
  filterByFavorite: boolean; // Add filterByFavorite state
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: 'name' | 'createdAt' | 'updatedAt') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setSelectedTags: (tags: string[]) => void; // 添加 setSelectedTags action
  setFilterByFavorite: (filter: boolean) => void; // Add setFilterByFavorite action
  fetchContacts: (params?: ContactQueryParams) => Promise<void>;
  getContactById: (id: string) => Contact | undefined;
  createContact: (contact: ContactCreate) => Promise<Contact | undefined>;
  updateContact: (id: string, contact: ContactUpdate) => Promise<Contact | undefined>;
  deleteContact: (id: string) => Promise<boolean>;
  getFilteredContacts: () => Contact[];
  toggleFavorite: (id: string) => Promise<void>; // Add toggleFavorite action
  setPaginationPage: (page: number) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  loading: false,
  error: null,
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedTags: [], // 初始化 selectedTags
  filterByFavorite: false, // Initialize filterByFavorite
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),

  setSortBy: (sortBy: 'name' | 'createdAt' | 'updatedAt') => set({ sortBy, pagination: { ...get().pagination, page: 1 } }),
  setSortOrder: (order: 'asc' | 'desc') => set({ sortOrder: order, pagination: { ...get().pagination, page: 1 } }),

  setSelectedTags: (tags: string[]) => set({ selectedTags: tags, pagination: { ...get().pagination, page: 1 } }), // 添加 setSelectedTags action

  setFilterByFavorite: (filter: boolean) => set({ filterByFavorite: filter, pagination: { ...get().pagination, page: 1 } }), // Add setFilterByFavorite action

  setPaginationPage: (page: number) => set((state) => ({ pagination: { ...state.pagination, page } })),

  fetchContacts: async (params?: ContactQueryParams) => {
    set({ loading: true, error: null });
    try {
      const { selectedTags, filterByFavorite } = get(); // Get filterByFavorite

      // 将 tags 转换为逗号分隔的字符串
      const tagsParam = selectedTags.length > 0 ? selectedTags.join(',') : undefined;

      const finalParams = {
        ...params,
        tags: tagsParam,
        isFavorite: filterByFavorite || undefined, // Add isFavorite to params
      };
      console.log("Fetching contacts with params:", finalParams); // 添加日志

      const response = await contactApi.getContacts(finalParams);
      if (response.code === 200) {
        set({
          contacts: response.data.contacts,
          pagination: response.data.pagination,
        });
      } else {
        set({ error: response.message });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch contacts' });
    } finally {
      set({ loading: false });
    }
  },

  getContactById: (id: string) => {
    return get().contacts.find(contact => contact.id === id);
  },

  createContact: async (contact: ContactCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await contactApi.createContact(contact);
      if (response.code === 200) {
        set((state) => ({
          contacts: [...state.contacts, response.data],
        }));
        return response.data;
      } else {
        set({ error: response.message });
        return undefined;
      }
    } catch (err: any) {
      console.log("Error caught in createContact:", err);
      let errorMessage = err.message || 'Failed to create contact';
      if (err.response?.data?.message && typeof err.response.data.message === 'string' && err.response.data.message.includes('电话号码已存在')) {
        errorMessage = '该手机号已被注册，请重输';
      }
      set({ error: errorMessage });
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  updateContact: async (id: string, contact: ContactUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await contactApi.updateContact(id, contact);
      if (response.code === 200) {
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? response.data : c)),
        }));
        return response.data;
      } else {
        set({ error: response.message });
        return undefined;
      }
    } catch (err: any) {
      console.log("Error caught in updateContact:", err);
      let errorMessage = err.message || 'Failed to update contact';
      if (err.response?.data?.message && typeof err.response.data.message === 'string' && err.response.data.message.includes('电话号码已存在')) {
        errorMessage = '该手机号已被注册，请重输';
      }
      set({ error: errorMessage });
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  deleteContact: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await contactApi.deleteContact(id);
      if (response.code === 200) {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
        return true;
      } else {
        set({ error: response.message });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete contact' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getFilteredContacts: () => {
    const { contacts, searchTerm } = get();
    if (!searchTerm) {
      return contacts;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.company?.toLowerCase().includes(lowerCaseSearchTerm) || // Add company to search filters
        contact.address?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  },

  toggleFavorite: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await contactApi.toggleFavoriteStatus(id);
      if (response.code === 200) {
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? response.data : c)),
        }));
        const { filterByFavorite, fetchContacts } = get(); // Get filterByFavorite and fetchContacts
        if (filterByFavorite) {
          await fetchContacts(); // Re-fetch contacts if currently filtering by favorites
        }
      } else {
        set({ error: response.message });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to toggle favorite status' });
    } finally {
      set({ loading: false });
    }
  },
}));

