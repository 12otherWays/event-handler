import { v4 as uuidv4 } from "uuid";

export class Tab {
    private tabName: string;
    private id: string;
    private isActive: boolean;
    private icon: string;
    constructor(tabName: string, isActive: boolean, icon: string) {
        this.tabName = tabName;
        this.id = this.generateTabId();
        this.isActive = isActive;
        this.icon = icon;
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

    setTabName(tabName: string): void {
        this.tabName = tabName;
    }

    setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    setIcon(icon: string): void {
        this.icon = icon;
    }


    generateTabId(): string {
        return uuidv4()
    }

}