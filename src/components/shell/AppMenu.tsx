"use client";
import { MoreHorizontal, Pencil, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = { onRefresh: () => void; onEdit: () => void; onSettings: () => void };

export function AppMenu({ onRefresh, onEdit, onSettings }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu" className="rounded-full">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}><Pencil className="size-4" /> Edit layout</DropdownMenuItem>
        <DropdownMenuItem onSelect={onSettings}><Settings className="size-4" /> Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onRefresh}><RefreshCw className="size-4" /> Refresh</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
