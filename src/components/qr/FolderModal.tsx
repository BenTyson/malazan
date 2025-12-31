'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Folder } from '@/lib/supabase/types';

// Preset folder colors
export const FOLDER_COLORS = [
  '#14b8a6', // Teal (primary)
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#6366f1', // Indigo
] as const;

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder?: Folder | null;
  onSave: (name: string, color: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function FolderModal({
  open,
  onOpenChange,
  folder,
  onSave,
  onDelete,
}: FolderModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(FOLDER_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!folder;

  // Reset form when modal opens/closes or folder changes
  useEffect(() => {
    if (open) {
      setName(folder?.name || '');
      setColor(folder?.color || FOLDER_COLORS[0]);
      setError(null);
    }
  }, [open, folder]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Folder name is required');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Folder name must be 50 characters or less');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(trimmedName, color);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await onDelete();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Folder' : 'Create Folder'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your folder name and color.'
              : 'Create a new folder to organize your QR codes.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Folder name */}
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="e.g., Marketing, Events, Products"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="bg-card/50 border-border/50 focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/50 characters
            </p>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Folder Color</Label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    color === colorOption
                      ? 'ring-2 ring-offset-2 ring-offset-card ring-primary scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  type="button"
                >
                  {color === colorOption && (
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="sm:mr-auto"
            >
              Delete Folder
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
