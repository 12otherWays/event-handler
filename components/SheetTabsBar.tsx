"use client";

import { Plus, Menu, MoreVertical } from "lucide-react";
import { Tab, TabData } from "@/classes/Tab";
import { Button } from "@/components/ui/button";

interface SheetTabsBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onAddTab: () => void;
  onEditTab: (data: TabData) => void;
}

export function SheetTabsBar({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onEditTab,
}: SheetTabsBarProps) {
  return (
    <div className="flex items-center bg-muted/30 border-t shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="flex items-center gap-1 px-2 py-1 border-r shrink-0 sticky left-0 bg-muted/30 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title="Add Sheet"
          onClick={onAddTab}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title="All sheets"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center flex-1">
        {tabs.map((tab) => {
          const tabColor = tab.getColor() || "#3b82f6";
          const isActive = activeTabId === tab.getId();
          return (
            <button
              key={tab.getId()}
              onClick={() => onSelectTab(tab.getId())}
              className={`relative px-4 py-2 text-sm font-medium border-r min-w-[120px] max-w-[200px] text-left transition-colors group/tab flex-shrink-0 flex items-center justify-between ${isActive
                ? "bg-background text-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted/50"
                }`}
              style={isActive ? { color: tabColor } : {}}
            >
              <span className="truncate block pr-2">{tab.getTabName()}</span>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTab(tab.toPlain());
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onEditTab(tab.toPlain());
                  }
                }}
                className="p-1 rounded hover:bg-muted opacity-0 group-hover/tab:opacity-100 transition-opacity cursor-pointer"
                title="Edit Sheet"
              >
                <MoreVertical className="h-3 w-3 text-muted-foreground" />
              </div>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: tabColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
