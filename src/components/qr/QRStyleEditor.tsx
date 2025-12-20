'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { QRStyleOptions } from '@/lib/qr/types';
import { cn } from '@/lib/utils';

interface QRStyleEditorProps {
  style: QRStyleOptions;
  onChange: (style: QRStyleOptions) => void;
}

const PRESET_COLORS = [
  { fg: '#000000', bg: '#ffffff', name: 'Classic' },
  { fg: '#1e3a5f', bg: '#ffffff', name: 'Navy' },
  { fg: '#14b8a6', bg: '#ffffff', name: 'Teal' },
  { fg: '#06b6d4', bg: '#ffffff', name: 'Cyan' },
  { fg: '#059669', bg: '#ffffff', name: 'Emerald' },
  { fg: '#dc2626', bg: '#ffffff', name: 'Red' },
  { fg: '#000000', bg: '#fef3c7', name: 'Cream' },
  { fg: '#ffffff', bg: '#000000', name: 'Inverted' },
];

export function QRStyleEditor({ style, onChange }: QRStyleEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateStyle = (updates: Partial<QRStyleOptions>) => {
    onChange({ ...style, ...updates });
  };

  return (
    <Card className="overflow-hidden glass">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="font-medium">Customize Style</span>
        </div>
        <svg
          className={cn(
            'w-5 h-5 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expandable Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6 space-y-6">
          {/* Color Presets */}
          <div>
            <Label className="mb-3 block">Color Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateStyle({
                    foregroundColor: preset.fg,
                    backgroundColor: preset.bg,
                  })}
                  className={cn(
                    'flex flex-col items-center p-2 rounded-lg transition-all',
                    'border-2',
                    style.foregroundColor === preset.fg && style.backgroundColor === preset.bg
                      ? 'border-primary'
                      : 'border-transparent hover:border-primary/30'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-md shadow-sm mb-1"
                    style={{ backgroundColor: preset.bg }}
                  >
                    <div
                      className="w-4 h-4 m-2 rounded-sm"
                      style={{ backgroundColor: preset.fg }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fgColor" className="mb-2 block">QR Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="fgColor"
                  value={style.foregroundColor}
                  onChange={(e) => updateStyle({ foregroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={style.foregroundColor}
                  onChange={(e) => updateStyle({ foregroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-md bg-secondary/50 border border-input text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bgColor" className="mb-2 block">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="bgColor"
                  value={style.backgroundColor}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={style.backgroundColor}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-md bg-secondary/50 border border-input text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div>
            <Label className="mb-3 block">Error Correction</Label>
            <div className="grid grid-cols-4 gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updateStyle({ errorCorrectionLevel: level })}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    style.errorCorrectionLevel === level
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 hover:bg-secondary'
                  )}
                >
                  {level === 'L' && 'Low (7%)'}
                  {level === 'M' && 'Medium (15%)'}
                  {level === 'Q' && 'Quartile (25%)'}
                  {level === 'H' && 'High (30%)'}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Higher error correction allows the QR code to be readable even if partially damaged or obscured.
            </p>
          </div>

          {/* Margin */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Quiet Zone (Margin)</Label>
              <span className="text-sm text-muted-foreground">{style.margin} modules</span>
            </div>
            <Slider
              value={[style.margin]}
              onValueChange={([value]) => updateStyle({ margin: value })}
              min={0}
              max={6}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
