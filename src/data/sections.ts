export interface Section {
  number: string;     // "01"
  label: string;      // "Index"
  href: string;       // "#" or "#about"
}

export const sections: Section[] = [
  { number: '01', label: 'Index',      href: '#index'      },
  { number: '02', label: 'Work',       href: '#projects'   },
  { number: '03', label: 'About',      href: '#about'      },
  { number: '04', label: 'Experience', href: '#experience' },
  { number: '05', label: 'Contact',    href: '#contact'    },
];
