"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, ChevronRight, Home, Plus, Loader2, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { WorkspaceFolder, WorkspaceItem } from "@/types";
import { FolderCard } from "./FolderCard";
import { ItemCard } from "./ItemCard";
import { NewFolderModal } from "./NewFolderModal";
import { WorkspaceToolbar } from "./WorkspaceToolbar";
import { ListView } from "./ListView";
import { BoardView } from "./BoardView";
import { QuickNotes } from "./QuickNotes";
import { UploadModal } from "./UploadModal";
import { NewDocModal } from "./NewDocModal";
import { BulkActionBar } from "./BulkActionBar";
import { MoveFolderModal } from "./MoveFolderModal";

export type ViewMode = "grid" | "list" | "board";
export type SortMode = "name-asc" | "name-desc" | "date-desc" | "date-asc";

export function WorkspaceClient() {
  const [folders, setFolders] = useState<WorkspaceFolder[]>([]);
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<WorkspaceFolder | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<WorkspaceFolder[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("date-desc");
  const [search, setSearch] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<string>>(new Set());
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefsSaved = useRef(false);

  function showToast(msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }

  // Load preferences
  useEffect(() => {
    fetch("/api/workspace/preferences")
      .then((r) => r.json())
      .then((p) => {
        const validViews: ViewMode[] = ["grid", "list", "board"];
        const validSorts: SortMode[] = ["name-asc", "name-desc", "date-desc", "date-asc"];
        if (validViews.includes(p.workspace_view)) setViewMode(p.workspace_view);
        if (validSorts.includes(p.workspace_sort)) setSortMode(p.workspace_sort);
        prefsSaved.current = true;
      });
  }, []);

  // Save preferences on change (after initial load) — debounced 400ms
  useEffect(() => {
    if (!prefsSaved.current) return;
    const t = setTimeout(() => {
      fetch("/api/workspace/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_view: viewMode, workspace_sort: sortMode })
      });
    }, 400);
    return () => clearTimeout(t);
  }, [viewMode, sortMode]);

  const loadFolders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/workspace/folders");
    if (res.ok) setFolders(await res.json());
    setLoading(false);
  }, []);

  const loadItems = useCallback(async (folderId: string) => {
    setLoadingItems(true);
    setSelectedFolderIds(new Set());
    setSelectedItemIds(new Set());
    const res = await fetch(`/api/workspace/folders/${folderId}/items`);
    if (res.ok) setItems(await res.json());
    setLoadingItems(false);
  }, []);

  useEffect(() => { loadFolders(); }, [loadFolders]);

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("workspace-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_folders" },
        () => { loadFolders(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_items" },
        () => { if (currentFolder) loadItems(currentFolder.id); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentFolder, loadFolders, loadItems]);

  function openFolder(folder: WorkspaceFolder) {
    setCurrentFolder(folder);
    setBreadcrumb((prev) => [...prev, folder]);
    setSearch("");
    loadItems(folder.id);
  }

  function navigateTo(index: number) {
    setSearch("");
    if (index === -1) {
      setCurrentFolder(null);
      setBreadcrumb([]);
      setItems([]);
    } else {
      const target = breadcrumb[index];
      setBreadcrumb(breadcrumb.slice(0, index + 1));
      setCurrentFolder(target);
      loadItems(target.id);
    }
  }

  async function handleDeleteFolder(id: string) {
    if (!confirm("¿Eliminar esta carpeta y todo su contenido?")) return;
    const res = await fetch(`/api/workspace/folders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } else {
      showToast("No se pudo eliminar la carpeta");
    }
  }

  async function handleRenameFolder(id: string, newName: string) {
    const res = await fetch(`/api/workspace/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    });
    if (res.ok) {
      const updated = await res.json();
      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
    }
  }

  async function handleDeleteItem(id: string) {
    const res = await fetch(`/api/workspace/items/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (currentFolder) {
        setFolders((prev) => prev.map((f) =>
          f.id === currentFolder.id ? { ...f, item_count: Math.max(0, (f.item_count ?? 1) - 1) } : f
        ));
      }
    } else {
      showToast("No se pudo eliminar el documento");
    }
  }

  async function handleUpdateItem(id: string, updates: Partial<WorkspaceItem>) {
    const res = await fetch(`/api/workspace/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updates } : i));
    }
  }

  async function handleMarkSeen(item: WorkspaceItem) {
    if (item.seen_at) return;
    const now = new Date().toISOString();
    handleUpdateItem(item.id, { seen_at: now, status: "reviewed" });
  }

  function handleFolderCreated(folder: WorkspaceFolder) {
    setFolders((prev) => [folder, ...prev]);
    setShowNewFolder(false);
  }

  function handleItemUploaded(item: WorkspaceItem) {
    setItems((prev) => [item, ...prev]);
    if (currentFolder) {
      setFolders((prev) => prev.map((f) =>
        f.id === currentFolder.id ? { ...f, item_count: (f.item_count ?? 0) + 1 } : f
      ));
    }
  }

  // --- Selection helpers ---
  function toggleFolderSelect(id: string) {
    setSelectedFolderIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleItemSelect(id: string) {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedFolderIds(new Set(visibleFolders.map((f) => f.id)));
    setSelectedItemIds(new Set(sortedItems.map((i) => i.id)));
  }

  function clearSelection() {
    setSelectedFolderIds(new Set());
    setSelectedItemIds(new Set());
  }

  // --- Bulk actions ---
  async function handleBulkDelete() {
    if (!confirm(`¿Eliminar ${totalSelected} elemento${totalSelected > 1 ? "s" : ""}? Esta acción no se puede deshacer.`)) return;

    const deletedFolderIds = new Set(selectedFolderIds);
    const deletedItemIds = new Set(selectedItemIds);

    const folderDeletes = [...deletedFolderIds].map((id) =>
      fetch(`/api/workspace/folders/${id}`, { method: "DELETE" }).then((r) => ({ id, ok: r.ok }))
    );
    const itemDeletes = [...deletedItemIds].map((id) =>
      fetch(`/api/workspace/items/${id}`, { method: "DELETE" }).then((r) => ({ id, ok: r.ok }))
    );

    const results = await Promise.allSettled([...folderDeletes, ...itemDeletes]);
    const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok));

    // Remove only successfully deleted items from UI
    const failedIds = new Set(
      results
        .filter((r): r is PromiseFulfilledResult<{ id: string; ok: boolean }> => r.status === "fulfilled" && !r.value.ok)
        .map((r) => r.value.id)
    );
    setFolders((prev) => prev.filter((f) => !deletedFolderIds.has(f.id) || failedIds.has(f.id)));
    setItems((prev) => prev.filter((i) => !deletedItemIds.has(i.id) || failedIds.has(i.id)));
    clearSelection();

    if (failed.length > 0) {
      showToast(`${failed.length} elemento${failed.length > 1 ? "s" : ""} no pudo eliminarse`);
    } else {
      const n = deletedFolderIds.size + deletedItemIds.size - failedIds.size;
      showToast(`${n} elemento${n > 1 ? "s" : ""} eliminado${n > 1 ? "s" : ""}`);
    }
  }

  async function handleBulkMove(targetFolderId: string) {
    const ids = [...selectedItemIds];
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/workspace/items/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder_id: targetFolderId })
        }).then((r) => ({ id, ok: r.ok }))
      )
    );
    const movedIds = new Set(
      results
        .filter((r): r is PromiseFulfilledResult<{ id: string; ok: boolean }> => r.status === "fulfilled" && r.value.ok)
        .map((r) => r.value.id)
    );
    const failed = ids.length - movedIds.size;
    setItems((prev) => prev.filter((i) => !movedIds.has(i.id)));
    setShowMoveModal(false);
    clearSelection();
    if (currentFolder) loadItems(currentFolder.id);
    if (failed > 0) {
      showToast(`${movedIds.size} movido${movedIds.size !== 1 ? "s" : ""}, ${failed} fallido${failed !== 1 ? "s" : ""}`);
    } else {
      showToast(`${movedIds.size} documento${movedIds.size !== 1 ? "s" : ""} movido${movedIds.size !== 1 ? "s" : ""}`);
    }
  }

  async function handleBulkStatus(status: string) {
    const ids = [...selectedItemIds];
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/workspace/items/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }).then((r) => ({ id, ok: r.ok }))
      )
    );
    const updatedIds = new Set(
      results
        .filter((r): r is PromiseFulfilledResult<{ id: string; ok: boolean }> => r.status === "fulfilled" && r.value.ok)
        .map((r) => r.value.id)
    );
    const failed = ids.length - updatedIds.size;
    setItems((prev) => prev.map((i) => updatedIds.has(i.id) ? { ...i, status: status as WorkspaceItem["status"] } : i));
    clearSelection();
    if (failed > 0) {
      showToast(`${updatedIds.size} actualizado${updatedIds.size !== 1 ? "s" : ""}, ${failed} fallido${failed !== 1 ? "s" : ""}`);
    } else {
      showToast(`Estado actualizado en ${updatedIds.size} documento${updatedIds.size !== 1 ? "s" : ""}`);
    }
  }

  // Filter by search
  const q = search.toLowerCase();
  const visibleFolders = folders
    .filter((f) => f.parent_id === (currentFolder?.id ?? null))
    .filter((f) => !q || f.name.toLowerCase().includes(q))
    .sort((a, b) => {
      if (sortMode === "name-asc") return a.name.localeCompare(b.name);
      if (sortMode === "name-desc") return b.name.localeCompare(a.name);
      if (sortMode === "date-desc") return b.created_at.localeCompare(a.created_at);
      return a.created_at.localeCompare(b.created_at);
    });

  const sortedItems = [...items]
    .filter((i) => !q || (i.document?.title ?? "").toLowerCase().includes(q))
    .sort((a, b) => {
      // Pinned siempre arriba
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortMode === "name-asc") return (a.document?.title ?? "").localeCompare(b.document?.title ?? "");
      if (sortMode === "name-desc") return (b.document?.title ?? "").localeCompare(a.document?.title ?? "");
      if (sortMode === "date-desc") return b.created_at.localeCompare(a.created_at);
      return a.created_at.localeCompare(b.created_at);
    });

  const selectionMode = selectedFolderIds.size > 0 || selectedItemIds.size > 0;
  const totalSelected = selectedFolderIds.size + selectedItemIds.size;
  const totalVisible = visibleFolders.length + sortedItems.length;

  const isHome = !currentFolder;
  const isEmpty = visibleFolders.length === 0 && (isHome || sortedItems.length === 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[#00D4AA] text-sm font-medium mb-1">Personal</p>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Monitor size={28} className="text-[#00D4AA]" />
            Mi Escritorio
          </h1>
        </div>
        <WorkspaceToolbar
          viewMode={viewMode}
          sortMode={sortMode}
          onViewChange={setViewMode}
          onSortChange={setSortMode}
          onNewFolder={() => setShowNewFolder(true)}
          onUpload={() => setShowUpload(true)}
          onNewDoc={() => setShowNewDoc(true)}
        />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar carpetas y documentos…"
          className="w-full pl-9 pr-9 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/40 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-6 text-sm">
        <button
          onClick={() => navigateTo(-1)}
          className={`flex items-center gap-1 transition-colors ${!currentFolder ? "text-[#00D4AA]" : "text-slate-400 hover:text-white"}`}
        >
          <Home size={14} />
          Inicio
        </button>
        {breadcrumb.map((f, i) => (
          <span key={f.id} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-slate-600" />
            <button
              onClick={() => navigateTo(i)}
              className={`transition-colors ${i === breadcrumb.length - 1 ? "text-white font-medium" : "text-slate-400 hover:text-white"}`}
            >
              {f.name}
            </button>
          </span>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#00D4AA]/50" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick notes (only on home) */}
          {isHome && !search && <QuickNotes />}

          {/* Board view (all items regardless of folder) */}
          {viewMode === "board" && currentFolder && (
            <BoardView
              items={sortedItems}
              loadingItems={loadingItems}
              selectedIds={selectedItemIds}
              selectionMode={selectionMode}
              onSelect={toggleItemSelect}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onMarkSeen={handleMarkSeen}
            />
          )}

          {/* Grid / List views */}
          {viewMode !== "board" && (
            <>
              {/* Folders */}
              {visibleFolders.length > 0 && (
                <div>
                  {currentFolder && (
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Subcarpetas</p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <AnimatePresence>
                      {visibleFolders.map((folder) => (
                        <FolderCard
                          key={folder.id}
                          folder={folder}
                          selected={selectedFolderIds.has(folder.id)}
                          selectionMode={selectionMode}
                          onSelect={() => toggleFolderSelect(folder.id)}
                          onOpen={() => openFolder(folder)}
                          onDelete={() => handleDeleteFolder(folder.id)}
                          onRename={(name) => handleRenameFolder(folder.id, name)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Items */}
              {currentFolder && (
                <div>
                  {sortedItems.length > 0 && (
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                      Documentos ({sortedItems.length})
                    </p>
                  )}
                  {loadingItems ? (
                    <div className="flex items-center gap-2 text-slate-500 py-4">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Cargando…</span>
                    </div>
                  ) : viewMode === "list" ? (
                    <ListView
                      items={sortedItems}
                      selectedIds={selectedItemIds}
                      selectionMode={selectionMode}
                      onSelect={toggleItemSelect}
                      onUpdateItem={handleUpdateItem}
                      onDeleteItem={handleDeleteItem}
                      onMarkSeen={handleMarkSeen}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <AnimatePresence>
                        {sortedItems.map((item) => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            selected={selectedItemIds.has(item.id)}
                            selectionMode={selectionMode}
                            onSelect={() => toggleItemSelect(item.id)}
                            onDelete={() => handleDeleteItem(item.id)}
                            onOpen={() => handleMarkSeen(item)}
                            onPin={() => handleUpdateItem(item.id, { pinned: !item.pinned })}
                            onStatusChange={(s) => handleUpdateItem(item.id, { status: s as WorkspaceItem["status"] })}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {isEmpty && !loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                    <Monitor size={36} className="text-[#00D4AA]/50" />
                  </div>
                  <p className="text-slate-400 text-lg font-medium mb-1">
                    {search ? "Sin resultados" : currentFolder ? "Carpeta vacía" : "Escritorio vacío"}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {search ? `Nada coincide con "${search}"` : currentFolder
                      ? "Sube un archivo o crea un documento nuevo"
                      : "Crea una carpeta para organizar tus documentos"}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showNewFolder && (
          <NewFolderModal
            parentId={currentFolder?.id ?? null}
            onCreated={handleFolderCreated}
            onClose={() => setShowNewFolder(false)}
          />
        )}
        {showUpload && (
          <UploadModal
            folderId={currentFolder?.id ?? null}
            onUploaded={handleItemUploaded}
            onClose={() => setShowUpload(false)}
          />
        )}
        {showNewDoc && (
          <NewDocModal
            folderId={currentFolder?.id ?? null}
            onCreated={handleItemUploaded}
            onClose={() => setShowNewDoc(false)}
          />
        )}
        {showMoveModal && (
          <MoveFolderModal
            folders={folders}
            currentFolderId={currentFolder?.id ?? null}
            itemCount={selectedItemIds.size}
            onMove={handleBulkMove}
            onClose={() => setShowMoveModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectionMode && (
          <BulkActionBar
            selectedCount={totalSelected}
            itemCount={selectedItemIds.size}
            folderCount={selectedFolderIds.size}
            allCount={totalVisible}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
            onDeleteSelected={handleBulkDelete}
            onMoveSelected={() => setShowMoveModal(true)}
            onStatusSelected={handleBulkStatus}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#0D1117]/95 backdrop-blur-md border border-[#00D4AA]/30 rounded-xl shadow-xl text-sm text-slate-200 whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
