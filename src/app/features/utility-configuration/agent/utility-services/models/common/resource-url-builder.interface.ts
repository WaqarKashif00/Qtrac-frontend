export interface IURLBuilder {
    BaseURL(): string;
    Get(id: string): string;
    Post(): string;
    Put(id: string): string;
}
