import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practice/$unit")({
  component: () => <Outlet />,
});
