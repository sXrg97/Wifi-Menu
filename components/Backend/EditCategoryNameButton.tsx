"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Loader2Icon, PenIcon } from "lucide-react";
import { MenuType } from "@/types/types";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { renameCategory } from "@/lib/actions/menu.actions";
import { set } from "mongoose";

const EditCategoryNameButton = ({
    menuId,
    categoryName,
    setMenu,
    setIsPageLoading,
}: {
    menuId: string;
    categoryName: string;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>>;
    setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [categoryNameInput, setCategoryNameInput] = useState(categoryName);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleEditCategoryName = async () => {
        if (categoryNameInput === categoryName) {
            toast({
                variant: "destructive",
                title: `Something went wrong! 😕`,
                description: `Numele categoriei este acelasi!`,
            });
            return;
        }

        try {
            setIsLoading(true);
            setIsPageLoading(true);
            const responseMenu = await renameCategory(menuId, categoryName, categoryNameInput);
            if (responseMenu) {
                toast({
                    variant: "success",
                    title: `Success! 🎉`,
                    description: `Numele categoriei a fost actualizat!`,
                });
                setMenu(responseMenu);
            }
        } catch (err) {
            console.log("Error editing category name:", err);
            toast({
                variant: "destructive",
                title: `Something went wrong! 😕`,
                description: `Numele categoriei nu a putut fi actualizat!`,
            });
        } finally {
            setIsPageLoading(false);
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-black p-1 rounded-sm flex flex-1 items-center justify-center transition-colors w-10"
                >
                    <PenIcon />{" "}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit category name</DialogTitle>
                    <DialogDescription>
                        Enter the name of the category. Click Save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category name
                        </Label>
                        <Input
                            id="category"
                            placeholder="eg. Pasta"
                            className="col-span-3"
                            onChange={(e) => setCategoryNameInput(e.target.value)}
                            value={categoryNameInput}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" onClick={handleEditCategoryName}>
                            {isLoading ? <Loader2Icon className="animate-spin text-black" /> : "Save"}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryNameButton;
