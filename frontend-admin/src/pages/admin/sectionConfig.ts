export interface SectionField {
    value: string;
    label: string;
    fields: string[];
}

export const sectionConfig: Record<string, SectionField[]> = {
    home: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'event-info', label: 'Event Info', fields: ['heading'] },
        { value: 'event-date', label: 'Event Date', fields: ['heading'] },
        { value: 'countdown-label', label: 'Countdown Label', fields: ['heading'] },
        { value: 'stat-elite-teams', label: 'Stat: Elite Teams', fields: ['heading'] },
        { value: 'stat-global-fans', label: 'Stat: Global Fans', fields: ['heading'] },
        { value: 'stat-djs-acts', label: 'Stat: DJs & Acts', fields: ['heading'] },
        { value: 'stat-prize-pool', label: 'Stat: Prize Pool', fields: ['heading'] },
        { value: 'sponsors-section', label: 'Sponsors Section Header', fields: ['heading', 'subheading'] },
        { value: 'news-section', label: 'News Section Header', fields: ['heading', 'subheading'] },
        { value: 'social-section', label: 'Social Feed Section', fields: ['heading', 'subheading'] },
        { value: 'festival-header', label: 'Festival: Section Header', fields: ['heading', 'subheading'] },
        { value: 'festival-intro', label: 'Festival: Main Text', fields: ['body'] },
        { value: 'festival-stages', label: 'Festival: Main Stages', fields: ['heading', 'subheading'] },
        { value: 'festival-village', label: 'Festival: Fan Village', fields: ['heading', 'subheading'] },
        { value: 'festival-market', label: 'Festival: Street Market', fields: ['heading', 'subheading'] },
        { value: 'festival-vip', label: 'Festival: VIP Lounges', fields: ['heading', 'subheading'] }
    ],
    tickets: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'event-info', label: 'Event Info', fields: ['heading'] },
        { value: 'whats-included', label: "What's Included Section", fields: ['heading', 'subheading'] },
        { value: 'feature-rugby', label: 'Feature: Elite Rugby', fields: ['heading', 'subheading'] },
        { value: 'feature-stage', label: 'Feature: Multi-Stage', fields: ['heading', 'subheading'] },
        { value: 'feature-food', label: 'Feature: Gastro Yard', fields: ['heading', 'subheading'] },
        { value: 'feature-finals', label: 'Feature: Showstoppers', fields: ['heading', 'subheading'] },
        { value: 'group-discount', label: 'Group Discount', fields: ['heading', 'body'] },
        { value: 'group-club-pass', label: 'Group: Club Bulk Pass', fields: ['heading', 'subheading'] },
        { value: 'group-early-bird', label: 'Group: Early Bird', fields: ['heading', 'subheading'] },
        { value: 'group-reserved', label: 'Group: Reserved Area', fields: ['heading', 'subheading'] }
    ],
    teams: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    visitors: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] },
        { value: 'info-venue', label: 'Venue Info Box', fields: ['heading', 'bodyItems'] },
        { value: 'info-food', label: 'Food & Drink Info Box', fields: ['heading', 'bodyItems'] },
        { value: 'info-entertainment', label: 'Entertainment Info Box', fields: ['heading', 'bodyItems'] },
        { value: 'getting-here', label: 'Getting Here Section', fields: ['heading', 'subheading'] },
        { value: 'transport-public', label: 'Transport: Public', fields: ['heading', 'subheading'] },
        { value: 'transport-cycling', label: 'Transport: Cycling', fields: ['heading', 'subheading'] },
        { value: 'transport-parking', label: 'Transport: Car Parking', fields: ['heading', 'subheading'] }
    ],
    rules: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] },
        { value: 'page-label', label: 'Page Label', fields: ['heading'] },
        { value: 'sidebar-specs', label: 'Sidebar: Official Specs', fields: ['heading', 'bodyItems'] }
    ],
    photos: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    sustainability: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'intro-label', label: 'Intro Label & Heading', fields: ['heading', 'subheading', 'body'] },
        { value: 'stat-recycled', label: 'Stat: Waste Recycled', fields: ['heading', 'subheading'] },
        { value: 'stat-plastics', label: 'Stat: Single Use Plastics', fields: ['heading', 'subheading'] },
        { value: 'card-circular', label: 'Card: Circular Economy', fields: ['heading', 'subheading'] },
        { value: 'card-power', label: 'Card: Renewable Power', fields: ['heading', 'subheading'] },
        { value: 'card-water', label: 'Card: Water Neutral', fields: ['heading', 'subheading'] },
        { value: 'card-carbon', label: 'Card: Carbon Offset', fields: ['heading', 'subheading'] },
        { value: 'intro', label: 'Intro Content', fields: ['heading', 'body', 'subheading'] }
    ],
    charity: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'snsg-intro', label: 'SNSG Intro Text', fields: ['heading', 'subheading', 'body'] },
        { value: 'snsg-stat-1', label: 'SNSG Stat 1 (e.g. €150k+)', fields: ['heading', 'subheading'] },
        { value: 'snsg-stat-2', label: 'SNSG Stat 2 (e.g. 5,000+)', fields: ['heading', 'subheading'] },
        { value: 'snsg-card-1', label: 'Feature Card 1', fields: ['heading', 'subheading'] },
        { value: 'snsg-card-2', label: 'Feature Card 2', fields: ['heading', 'subheading'] },
        { value: 'snsg-card-3', label: 'Feature Card 3', fields: ['heading', 'subheading'] },
        { value: 'snsg-card-4', label: 'Feature Card 4', fields: ['heading', 'subheading'] }
    ],
    recycle: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'cycle-header', label: 'Cycle Section Header', fields: ['heading', 'subheading'] },
        { value: 'step-01', label: 'Step 01: Smart Sorting', fields: ['heading', 'subheading'] },
        { value: 'step-02', label: 'Step 02: On-Site Bio', fields: ['heading', 'subheading'] },
        { value: 'step-03', label: 'Step 03: Green Logistics', fields: ['heading', 'subheading'] },
        { value: 'step-04', label: 'Step 04: Re-Entry', fields: ['heading', 'subheading'] },
        { value: 'rewards-header', label: 'Rewards Section Header', fields: ['heading', 'subheading', 'body'] },
        { value: 'reward-01', label: 'Reward 01: Statiegeld', fields: ['heading', 'subheading'] },
        { value: 'reward-02', label: 'Reward 02: Clean Squad', fields: ['heading', 'subheading'] },
        { value: 'reward-03', label: 'Reward 03: Token Boost', fields: ['heading', 'subheading'] },
        { value: 'crew-section', label: 'Innovation Crew Section', fields: ['heading', 'bodyItems'] },
        { value: 'cycle', label: 'Cycle Section', fields: ['heading'] },
        { value: 'rewards', label: 'Rewards Section', fields: ['heading', 'subheading', 'body'] }
    ]
};
