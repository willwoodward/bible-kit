import { Search, MapPin, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activePanel: 'search' | 'context' | 'analysis' | null;
  onPanelChange: (panel: 'search' | 'context' | 'analysis' | null) => void;
}

export function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  const tools = [
    { id: 'search' as const, icon: Search, label: 'Search Bible' },
    { id: 'context' as const, icon: MapPin, label: 'Context' },
    { id: 'analysis' as const, icon: BarChart3, label: 'Analysis' },
  ];

  return (
    <div className="fixed left-0 top-12 h-[calc(100vh-3rem)] w-16 bg-black border-r border-zinc-800 z-40 flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activePanel === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => onPanelChange(isActive ? null : tool.id)}
            className={`
              p-3 rounded-lg transition-colors relative group
              ${isActive
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }
            `}
            aria-label={tool.label}
          >
            <Icon className="h-5 w-5" />

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tool.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
