export interface TaskItems {
  header:Array<{
    text: string;
    width?: string | number
  }>,
  data: Array<{
    date?: string;
    task?: string;
    subtask?: string;
    time?: string
  }>
}

export interface TeamNotifications {
  header:string,
  data: Array<{
    name?: string;
    imgSrc?: string
  }>,
  action?: string;
}

