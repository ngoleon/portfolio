export interface Section {
  number: string;     // "01"
  label: string;      // "Index"
  href: string;       // "#" or "#about"
}

export const sections: Section[] = [
  { number: '01', label: 'Index',      href: '#index'      },
  { number: '02', label: 'About',      href: '#about'      },
  { number: '03', label: 'Experience', href: '#experience' },
  { number: '04', label: 'Projects',   href: '#projects'   },
  { number: '05', label: 'Contact',    href: '#contact'    },
];
