'use client';

import { useState } from 'react';
import { FolderPlus, FolderOpen, Pencil, Crown, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderModal } from './FolderModal';
import type { Folder, SubscriptionTier, QRCode } from '@/lib/supabase/types';
import { TIER_LIMITS } from '@/lib/supabase/types';

interface FolderManagerProps {
  folders: Folder[];
  qrCodes: QRCode[];
  selectedFolder: string | null;
  tier: SubscriptionTier;
  onFolderSelect: (folderId: string | null) => void;
  onFolderCreate: (name: string, color: string) => Promise<void>;
  onFolderUpdate: (id: string, name: string, color: string) => Promise<void>;
  onFolderDelete: (id: string) => Promise<void>;
}

export function FolderManager({
  folders,
  qrCodes,
  selectedFolder,
  tier,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
}: FolderManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const canUseFolders = tier !== 'free';
  const folderLimit = TIER_LIMITS[tier].folders;
  const canCreateMore = typeof folderLimit === 'number' ? folders.length < folderLimit : true;

  // Count QR codes per folder
  const getCodeCount = (folderId: string | null) => {
    if (folderId === null) {
      return qrCodes.length;
    }
    if (folderId === 'uncategorized') {
      return qrCodes.filter((qr) => !qr.folder_id).length;
    }
    return qrCodes.filter((qr) => qr.folder_id === folderId).length;
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setIsModalOpen(true);
  };

  const handleEditFolder = (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(folder);
    setIsModalOpen(true);
  };

  const handleSave = async (name: string, color: string) => {
    if (editingFolder) {
      await onFolderUpdate(editingFolder.id, name, color);
    } else {
      await onFolderCreate(name, color);
    }
  };

  const handleDelete = async () => {
    if (editingFolder) {
      await onFolderDelete(editingFolder.id);
      // If we deleted the selected folder, reset selection
      if (selectedFolder === editingFolder.id) {
        onFolderSelect(null);
      }
    }
  };

  // Show upgrade prompt for free users
  if (!canUseFolders) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5 p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
          <FolderOpen className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Organize with Folders</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to Pro to create folders and organize your QR codes.
        </p>
        <Badge className="bg-gradient-to-r from-primary to-cyan-500 text-white border-0">
          <Crown className="w-3 h-3 mr-1" />
          Pro Feature
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground">Folders</h3>
        {canCreateMore ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateFolder}
            className="h-7 px-2 text-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 mr-1" />
            New
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            {folders.length}/{folderLimit} folders
          </span>
        )}
      </div>

      {/* Folder list */}
      <div className="space-y-1">
        {/* All QR Codes */}
        <button
          onClick={() => onFolderSelect(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            selectedFolder === null
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="flex-1 text-left text-sm font-medium">All QR Codes</span>
          <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
            {getCodeCount(null)}
          </span>
        </button>

        {/* Uncategorized */}
        <button
          onClick={() => onFolderSelect('uncategorized')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            selectedFolder === 'uncategorized'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span className="flex-1 text-left text-sm">Uncategorized</span>
          <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
            {getCodeCount('uncategorized')}
          </span>
        </button>

        {/* User folders */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            role="button"
            tabIndex={0}
            onClick={() => onFolderSelect(folder.id)}
            onKeyDown={(e) => e.key === 'Enter' && onFolderSelect(folder.id)}
            className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              selectedFolder === folder.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div
              className="w-4 h-4 rounded-md"
              style={{ backgroundColor: folder.color }}
            />
            <span className="flex-1 text-left text-sm truncate">
              {folder.name}
            </span>
            <button
              onClick={(e) => handleEditFolder(folder, e)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
              {getCodeCount(folder.id)}
            </span>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {folders.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No folders yet. Create one to organize your QR codes.
        </p>
      )}

      {/* Folder modal */}
      <FolderModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        folder={editingFolder}
        onSave={handleSave}
        onDelete={editingFolder ? handleDelete : undefined}
      />
    </div>
  );
}
