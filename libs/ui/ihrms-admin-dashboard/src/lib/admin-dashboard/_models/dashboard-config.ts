import { ComponentRef } from '@angular/core';
import { compactTypes } from 'angular-gridster2/lib/gridsterConfig.interface';
import { TeamNotifications } from './team-notifications';

export interface DashboardConfiguration {
  dynamicComponent: ComponentRef<compactTypes>;
  gridsterItem: {
    cols: number, rows: number, y: number, x: number
  };
  inputs: {
    cardRadius: number,
    palette: number
  },
  outputs: {
    callback: () => void;
  }
}

export const constTeamNotifications: TeamNotifications[] = [
  {
    header: 'Team members Birthdays today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
      { name: 'Member 2', imgSrc: './assets/avtar_2.png' },
      { name: 'Member 3', imgSrc: './assets/batman_hero_avatar_comics-512.webp' }
    ],
    action: 'View All'
  },
  {
    header: 'Team members on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
      { name: 'Member 2', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
      { name: 'Member 3', imgSrc: './assets/batman_hero_avatar_comics-512.webp' }
    ],
    action: 'View All'
  },
  {
    header: 'New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
      { name: 'Member 2', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
      { name: 'Member 3', imgSrc: './assets/avtar_2.png' }
    ],
    action: 'View All'
  }
];
