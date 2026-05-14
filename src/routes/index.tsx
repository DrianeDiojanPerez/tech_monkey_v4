import { createFileRoute } from "@tanstack/react-router"
import { TechMonkeysLanding } from "@/components/tech-monkeys/landing-page"

export const Route = createFileRoute("/")({ component: TechMonkeysLanding })
