export interface Ticket {
    _id: string;
    title: string;
    price: number;
    features: string[];
    recommended: boolean;
    order: number;
}

export interface Team {
    _id: string;
    name: string;
    country: string;
    category: 'ELITE MEN' | 'ELITE WOMEN' | 'SOCIAL' | 'VETS';
    color?: string;
    logo?: string;
}

export interface Sponsor {
    _id: string;
    name: string;
    subName?: string;
    role?: string;
    type: 'official-sponsors' | 'sub-sponsors';
    img?: string;
}

export interface NewsItem {
    _id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    img?: string;
}

export interface Image {
    _id: string;
    img: string;
    type: string;
}

export interface Rule {
    _id: string;
    title: string;
    rules: string[];
    category?: string;
    order?: number;
}

export interface SiteConfig {
    key: string;
    value: any;
}
