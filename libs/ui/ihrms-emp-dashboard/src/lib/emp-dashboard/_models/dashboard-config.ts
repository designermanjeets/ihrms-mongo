import { ComponentRef } from '@angular/core';
import { compactTypes } from 'angular-gridster2/lib/gridsterConfig.interface';
import { TeamNotifications } from './task-items';

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
    header: '5 Team members have Birthdays today',
    data: [
      { name: 'Member 2', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
  {
    header: '3 Team members are on Leave Today',
    data: [
      { name: 'Member 1', imgSrc: './assets/batman_hero_avatar_comics-512.webp' },
    ],
    action: 'View All'
  },
  {
    header: '5 New Team Members',
    data: [
      { name: 'Member 1', imgSrc: './assets/avtar_2.png' },
    ],
    action: 'View All'
  },
];

export const constMyTasksItems = {
  header: [{ text: 'Date', width: '75px' }, { text: 'Comment'}, { text: 'Time', width: '85px' }],
  data: [
    { date: '09 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '10 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '11 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '12 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '10 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '11 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '12 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '11 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' },
    { date: '12 May', task: 'Lorem Ipsum', subtask: 'dolor sit', time: '8:30 PM' }
  ]
};
