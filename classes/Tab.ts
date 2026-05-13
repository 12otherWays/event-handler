import { v4 as uuidv4 } from "uuid";

export interface TabData {
    id: string;
    tabName: string;
    isActive: boolean;
    icon: string;
    color: string;
}

export class Tab {
    private tabName: string;
    private id: string;
    private isActive: boolean;
    private icon: string;
    private color: string;

    constructor(tabName: string, isActive: boolean, icon: string, color: string = "#3b82f6", id?: string) {
        this.tabName = tabName;
        this.id = id ?? this.generateTabId();
        this.isActive = isActive;
        this.icon = icon;
        this.color = color;
    }

    getTabName(): string {
        return this.tabName;
    }

    getId(): string {
        return this.id;
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getIcon(): string {
        return this.icon;
    }

    getColor(): string {
        return this.color;
    }

    setTabName(tabName: string): void {
        this.tabName = tabName;
    }

    setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    setIcon(icon: string): void {
        this.icon = icon;
    }

    setColor(color: string): void {
        this.color = color;
    }

    generateTabId(): string {
        return uuidv4();
    }

    /** Serialize to a plain object for localStorage / JSON. */
    toPlain(): TabData {
        return {
            id: this.id,
            tabName: this.tabName,
            isActive: this.isActive,
            icon: this.icon,
            color: this.color,
        };
    }

    /** Reconstruct a Tab instance from a plain object. */
    static fromPlain(data: TabData): Tab {
        return new Tab(data.tabName, data.isActive, data.icon, data.color, data.id);
    }
}