'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Category, MenuItem, DailyMenu, BusinessInfo, GalleryImage, Review } from './types'
import { defaultCategories, defaultMenuItems, defaultDailyMenu, defaultBusinessInfo, defaultGalleryImages, defaultReviews } from './data'

interface StoreContextType {
  // Menu Items
  menuItems: MenuItem[]
  addItem: (item: MenuItem) => void
  updateItem: (item: MenuItem) => void
  deleteItem: (id: string) => void
  toggleSoldOut: (id: string) => void
  // Categories
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  // Daily Menu
  dailyMenu: DailyMenu
  updateDailyMenu: (menu: DailyMenu) => void
  // Business Info
  businessInfo: BusinessInfo
  updateBusinessInfo: (info: BusinessInfo) => void
  // Gallery
  galleryImages: GalleryImage[]
  addGalleryImage: (image: GalleryImage) => void
  updateGalleryImage: (image: GalleryImage) => void
  deleteGalleryImage: (id: string) => void
  // Reviews
  reviews: Review[]
  addReview: (review: Review) => void
  updateReview: (review: Review) => void
  deleteReview: (id: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

const KEYS = {
  items: 'hakuna_menu_items',
  categories: 'hakuna_categories',
  dailyMenu: 'hakuna_daily_menu',
  businessInfo: 'hakuna_business_info',
  gallery: 'hakuna_gallery',
  reviews: 'hakuna_reviews',
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored) as T
  } catch { /* ignore */ }
  return fallback
}

function save<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(data)) } catch { /* ignore */ }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dailyMenu, setDailyMenu] = useState<DailyMenu>(defaultDailyMenu)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setMenuItems(load<MenuItem[]>(KEYS.items, defaultMenuItems))
    setCategories(load<Category[]>(KEYS.categories, defaultCategories))
    setDailyMenu(load<DailyMenu>(KEYS.dailyMenu, defaultDailyMenu))
    setBusinessInfo(load<BusinessInfo>(KEYS.businessInfo, defaultBusinessInfo))
    setGalleryImages(load<GalleryImage[]>(KEYS.gallery, defaultGalleryImages))
    setReviews(load<Review[]>(KEYS.reviews, defaultReviews))
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) save(KEYS.items, menuItems) }, [menuItems, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.categories, categories) }, [categories, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.dailyMenu, dailyMenu) }, [dailyMenu, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.businessInfo, businessInfo) }, [businessInfo, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.gallery, galleryImages) }, [galleryImages, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.reviews, reviews) }, [reviews, hydrated])

  // Menu Items
  const addItem = useCallback((item: MenuItem) => setMenuItems(prev => [...prev, item]), [])
  const updateItem = useCallback((item: MenuItem) => setMenuItems(prev => prev.map(i => i.id === item.id ? item : i)), [])
  const deleteItem = useCallback((id: string) => setMenuItems(prev => prev.filter(i => i.id !== id)), [])
  const toggleSoldOut = useCallback((id: string) => setMenuItems(prev => prev.map(i => i.id === id ? { ...i, soldOut: !i.soldOut } : i)), [])

  // Categories
  const addCategory = useCallback((c: Category) => setCategories(prev => [...prev, c]), [])
  const updateCategory = useCallback((c: Category) => setCategories(prev => prev.map(i => i.id === c.id ? c : i)), [])
  const deleteCategory = useCallback((id: string) => setCategories(prev => prev.filter(i => i.id !== id)), [])

  // Daily Menu
  const updateDailyMenu = useCallback((m: DailyMenu) => setDailyMenu(m), [])

  // Business Info
  const updateBusinessInfo = useCallback((info: BusinessInfo) => setBusinessInfo(info), [])

  // Gallery
  const addGalleryImage = useCallback((img: GalleryImage) => setGalleryImages(prev => [...prev, img]), [])
  const updateGalleryImage = useCallback((img: GalleryImage) => setGalleryImages(prev => prev.map(i => i.id === img.id ? img : i)), [])
  const deleteGalleryImage = useCallback((id: string) => setGalleryImages(prev => prev.filter(i => i.id !== id)), [])

  // Reviews
  const addReview = useCallback((r: Review) => setReviews(prev => [...prev, r]), [])
  const updateReview = useCallback((r: Review) => setReviews(prev => prev.map(i => i.id === r.id ? r : i)), [])
  const deleteReview = useCallback((id: string) => setReviews(prev => prev.filter(i => i.id !== id)), [])

  return (
    <StoreContext.Provider value={{
      menuItems, addItem, updateItem, deleteItem, toggleSoldOut,
      categories, addCategory, updateCategory, deleteCategory,
      dailyMenu, updateDailyMenu,
      businessInfo, updateBusinessInfo,
      galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage,
      reviews, addReview, updateReview, deleteReview,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
