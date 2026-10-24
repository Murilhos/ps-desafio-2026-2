"use client";

import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/dialog";
import FormFieldsMember from "./form-fields-member";
import { updateMember } from "@/actions/member";
import { filterFormData } from "@/services/filter-form-data";
import { useState } from "react";
import { useToast } from "@/components/use-toast";
import { membroType } from "@/types/member";
import SkeletonFormFieldsMember from "./skeleton-members";

interface DialogUpdateMemberProps {
  member: membroType;
  children: React.ReactNode;
}

export function DialogUpdateMember({ member, children }: DialogUpdateMemberProps) {
  const [open, setOpen] = useState<boolean>();
  const { toast } = useToast();

  const submit = async (form: FormData) => {
    const newForm = await filterFormData(form);

    console.log('Dados enviados:', Object.fromEntries(newForm.entries()))

    const { error } = await JSON.parse(await updateMember(newForm));

    console.log('Resposta do servidor:', error)

    if (error) {
      toast({
        title: "Não foi possível editar o membro!",
      });
    } else {
      toast({
        title: "Membro editado com sucesso!",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar membro</DialogTitle>
          <DialogDescription>
            Atualize as informações do membro abaixo e clique em
            &quot;Salvar&quot; para aplicar as alterações.
          </DialogDescription>
        </DialogHeader>
        <form action={submit}>
          {member ? (
            <FormFieldsMember member={member} />
          ) : (
            <SkeletonFormFieldsMember />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
