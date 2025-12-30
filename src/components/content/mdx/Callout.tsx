import { cn } from '@/lib/utils';
import { AlertCircle, Info, Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'error' | 'note';
  title?: string;
  children: React.ReactNode;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  error: AlertCircle,
  note: Sparkles,
};

const styles = {
  info: {
    border: 'border-primary/40',
    bg: 'bg-primary/5',
    iconBg: 'bg-primary/10',
    icon: 'text-primary',
    title: 'text-primary',
  },
  warning: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    iconBg: 'bg-amber-500/10',
    icon: 'text-amber-500',
    title: 'text-amber-500',
  },
  tip: {
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/5',
    iconBg: 'bg-cyan-500/10',
    icon: 'text-cyan-500',
    title: 'text-cyan-500',
  },
  error: {
    border: 'border-red-500/40',
    bg: 'bg-red-500/5',
    iconBg: 'bg-red-500/10',
    icon: 'text-red-500',
    title: 'text-red-500',
  },
  note: {
    border: 'border-slate-500/40',
    bg: 'bg-slate-800/50',
    iconBg: 'bg-slate-700/50',
    icon: 'text-slate-400',
    title: 'text-slate-300',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const Icon = icons[type];
  const style = styles[type];

  return (
    <div
      className={cn(
        'my-8 rounded-2xl border p-5',
        'backdrop-blur-sm',
        style.border,
        style.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          style.iconBg
        )}>
          <Icon className={cn('w-5 h-5', style.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn('font-semibold mb-2', style.title)}>
              {title}
            </p>
          )}
          <div className="text-sm text-slate-400 leading-relaxed [&>p]:mb-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
