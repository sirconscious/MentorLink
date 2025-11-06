import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button" 
import { usePage } from '@inertiajs/react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

export function NavMain({
  items
}) { 
  const { url: currentUrl } = usePage();
  
  const isActiveItem = (itemUrl) => {
    if (currentUrl === itemUrl) return true;
    if (currentUrl.startsWith(itemUrl + '/')) return true;
    if (itemUrl === '/' && currentUrl === '/') return true;
    return false;
  };
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline">
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveItem(item.url);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => router.get(item.url)} 
                  tooltip={item.title}
                  className={cn(
                    "transition-colors duration-200",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}