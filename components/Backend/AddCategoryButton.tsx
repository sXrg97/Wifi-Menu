"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCategory } from "@/lib/actions/menu.actions";
import { MenuType } from "@/types/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChangeEvent, useState } from "react";
import { useToast } from "../ui/use-toast";
import { PlusIcon } from "lucide-react";

const AddCategoryButton = ({
    menuId,
    setMenu,
}: {
    menuId: string;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>>;
}) => {
    const [categoryName, setCategoryName] = useState("");

    const [isOpen, setIsOpen] = useState(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    };

    const { toast } = useToast();

    type AddCategoryType = {
        success: boolean;
        error?: string;
        updatedMenu?: MenuType;
    };

    const handleSave = async () => {
        try {
            const res = (await addCategory(menuId, categoryName)) as AddCategoryType;
            if (res?.success && res.updatedMenu) {
                toast({
                    variant: "success",
                    title: `Succes! 🎉`,
                    description: `Categoria ${categoryName} a fost creata!`,
                });
                setMenu(res.updatedMenu);
                // setIsOpen(false);
            } else {
                toast({
                    variant: "destructive",
                    title: `Ceva nu a mers bine! 😕`,
                    description: `Categoria ${categoryName} exista deja!`,
                });
            }
        } catch (error) {
            console.log("Error adding category: ", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon /> Categorie
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-[600px] overflow-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Adauga Categorie</DialogTitle>
                    <DialogDescription>
                        Introdu numele categoriei.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-left">
                            Nume categorie
                        </Label>
                        <Input
                            id="category"
                            placeholder="eg. Paste"
                            className="col-span-1 md:col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={categoryName}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" onClick={handleSave} className="bg-purple-500">
                            Salvează
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryButton;
