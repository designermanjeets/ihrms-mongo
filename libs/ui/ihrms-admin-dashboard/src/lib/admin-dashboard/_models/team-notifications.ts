export interface TeamNotifications {
  header:string,
  data: Array<{
    name?: string;
    imgSrc?: string
  }>,
  action?: string;
}
