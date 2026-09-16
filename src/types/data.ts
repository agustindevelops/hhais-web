import type { StaticImageData } from "next/image";

export type NavbarLinkChildProps = {
  label: string;
  link: string;
};

export type NavbarLinkProps = {
  label: string;
  link: string;
  /** Optional dropdown children - renders as submenu */
  children?: NavbarLinkChildProps[];
}

export type PageType = {
  name: string
  url: string
  image: StaticImageData
}

export type FaqType = {
  id: number
  question: string
  answer: string
}

export type FooterLinkType = {
  title: string
  links: {
    url?: string
    name: string
  }[]
}

export type ProjectType = {
  projectId: number;
  title: string;
  subTitle: string;
  content: string[];
  image: StaticImageData;
  cta?: {
    url: string;
    label: string;
    hook: string;
    icon: string;
  }
}
