"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarNav,
  SidebarNavLink,
  SidebarNavLinkLabel,
  SidebarFooter,
  SidebarHeaderLogo,
  UserDropdown,
} from "@/components/dashboard/sidebar";
import { LuClipboard, LuHouse, LuListTodo, LuLogOut, LuUsers } from "react-icons/lu";
import { DropdownMenuItem } from "@/components/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import logo from "@/assets/img/logo.jpeg";

export function SidebarMain() {
  const session = useSession();
  const user = session?.data?.user;

  return (
    <Sidebar>
      <SidebarHeader href="/admin">
        <SidebarHeaderLogo src={logo} alt="Logo Dashboard" />
        <SidebarHeaderTitle>Adapti</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarNav>
        <SidebarNavLink href="/admin">
          <LuHouse />
          <SidebarNavLinkLabel>Home</SidebarNavLinkLabel>
        </SidebarNavLink>
        <SidebarNavLink href="/admin/membros">
          <LuUsers />
          <SidebarNavLinkLabel>Membros</SidebarNavLinkLabel>
        </SidebarNavLink>
        <SidebarNavLink href="/admin/projetos">
          <LuClipboard />
          <SidebarNavLinkLabel>Projetos</SidebarNavLinkLabel>
        </SidebarNavLink>
        <SidebarNavLink href="/admin/tarefas">
          <LuListTodo />
          <SidebarNavLinkLabel>Tarefas</SidebarNavLinkLabel>
        </SidebarNavLink>
      </SidebarNav>
      <SidebarFooter>
        <UserDropdown name={user?.name} email={user?.email} src={user?.image}>
          <DropdownMenuItem onClick={async () => await signOut()}>
            <LuLogOut className="w-3 h-3 mr-3" />
            Log out
          </DropdownMenuItem>
        </UserDropdown>
      </SidebarFooter>
    </Sidebar>
  );
}