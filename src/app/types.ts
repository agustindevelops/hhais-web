import type { StaticImageData } from "next/image"

export type ToolType = {
  icon: string
  title: string
  description: string
}

export type FeatureType = {
  icon: string
  name: string
  description: string
}

export type TopicType = {
  id: number
  title: string
  description: string
  avatars: StaticImageData[]
}

export type BusinessModelType = {
  icon: string
  title: string
  description: string[]
}

export type TestimonialType = {
  name: string
  avatar: StaticImageData
  description: string
}

export type PricingType = {
  name: string
  price: number
  features: string[]
}

