import { createFileRoute } from "@tanstack/react-router";
import { FlowerQuestApp } from "@/components/game/FlowerQuestApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <FlowerQuestApp />;
}
