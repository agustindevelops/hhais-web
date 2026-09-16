import type { NavbarLinkProps, PageType } from "@/types/data";

import demo1 from '@/assets/images/demo/demo1.png'
import demo2 from '@/assets/images/demo/demo2.png'
import demo3 from '@/assets/images/demo/demo3.png'
import demo4 from '@/assets/images/demo/demo4.png'
import demo5 from '@/assets/images/demo/demo5.png'

import login from '@/assets/images/demo/auth-login.png'
import loginQr from '@/assets/images/demo/auth-qr-login.png'
import register from '@/assets/images/demo/auth-register.png'
import lockScreen from '@/assets/images/demo/auth-lock-screen.png'
import forgotPass from '@/assets/images/demo/auth-forgotpw.png'
import logout from '@/assets/images/demo/auth-logout.png'
import type { FeatureType } from "./types";

export const navLinks: NavbarLinkProps[] = [
  { label: 'Home', link: '#home' },
  { label: 'Demo', link: '#demo' },
  { label: 'Features', link: '#features' },
]

export const demoPages = [demo1, demo2, demo3, demo4, demo5]
export const accountPages = [login, loginQr, register, lockScreen, forgotPass]

export const demosPages: PageType[] = [
  {
    name: 'Web 3',
    url: '/pages/index-1',
    image: demo1,
  },
  {
    name: 'Image Generator',
    url: '/pages/index-2',
    image: demo2,
  },
  {
    name: 'Video Creator',
    url: '/pages/index-3',
    image: demo3,
  },
  {
    name: 'Content Creator',
    url: '/pages/index-4',
    image: demo4,
  },
  {
    name: 'Business Tools',
    url: '/pages/index-5',
    image: demo5,
  },
]

export const authPages: PageType[] = [
  {
    name: 'Sign In',
    url: '/auth/login',
    image: login,
  },
  {
    name: 'SignIn with QR',
    url: '/auth/qr-login',
    image: loginQr,
  },
  {
    name: 'Sign Up',
    url: '/auth/register',
    image: register,
  },
  {
    name: 'Lock Screen',
    url: '/auth/lock-screen',
    image: lockScreen,
  },
  {
    name: 'Forgot Password',
    url: '/auth/forgot-pw',
    image: forgotPass,
  },
  {
    name: 'Logout',
    url: '/auth/logout',
    image: logout,
  },
]

export const features: FeatureType[] = [
  {
    name: 'Fully Responsive',
    icon: 'lucide:tablet-smartphone',
  },
  {
    name: 'Cross-browser compatible',
    icon: 'lucide:chrome',
  },
  {
    name: 'Easy to customize',
    icon: 'lucide:cog',
  },
  {
    name: 'Developer Friendly',
    icon: 'lucide:cpu',
  },
  {
    name: 'Clean & Easy to Understand Code',
    icon: 'lucide:code-xml',
  },
  {
    name: 'Font and SVG Icons',
    icon: 'lucide:dribbble',
  },
  {
    name: 'Free Updates',
    icon: 'lucide:check-check',
  },
  {
    name: 'Ultimate Support',
    icon: 'lucide:badge-help',
  },
]