import { useTheme } from '@/Pages/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check, Sparkles, Coffee, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const { currentTheme, switchTheme } = useTheme();

  const themes = [
    {
      id: 'theme1',
      name: 'Candyland',
      description: 'Bright and playful',
      icon: <Sparkles className="h-4 w-4" />,
      colors: ['bg-[#ff6b6b]', 'bg-[#4ecdc4]', 'bg-[#ffe66d]']
    },
    {
      id: 'theme2',
      name: 'Catppuccin', 
      description: 'Soothing pastels',
      icon: <Coffee className="h-4 w-4" />,
      colors: ['bg-[#cba6f7]', 'bg-[#f5c2e7]', 'bg-[#f2cdcd]']
    },
    {
      id: 'theme3',
      name: 'Midnight',
      description: 'Elegant and deep',
      icon: <Moon className="h-4 w-4" />,
      colors: ['bg-[#5676f7]', 'bg-[#6475ff]', 'bg-[#6746ff]']
    }
  ];

  const currentThemeData = themes.find(theme => theme.id === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 px-2"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">{currentThemeData?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
          Select Theme
        </div>
        
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => switchTheme(theme.id)}
            className="flex items-center justify-between gap-3 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Color preview dots */}
              <div className="flex gap-0.5">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${color} border border-border`}
                  />
                ))}
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium">{theme.name}</span>
                <span className="text-xs text-muted-foreground">
                  {theme.description}
                </span>
              </div>
            </div>
            
            {currentTheme === theme.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}