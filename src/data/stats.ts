export interface Stat {
  label: string;
  value: number; // 0-100
}

export const stats: Stat[] = [
  { label: 'CLOUD', value: 85 },
  { label: '.NET',  value: 90 },
  { label: 'K8S',   value: 78 },
  { label: 'JAVA',  value: 75 },
  { label: 'TYPE',  value: 88 },
  { label: 'EMBED.', value: 65 },
];
