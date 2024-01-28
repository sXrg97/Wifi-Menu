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
                    title: `Success! 🎉`,
                    description: `Category ${categoryName} has been created!`,
                });
                setMenu(res.updatedMenu);
            } else {
                toast({
                    variant: "destructive",
                    title: `Something went wrong! 😕`,
                    description: `Category ${categoryName} already exists!`,
                });
            }
        } catch (error) {
            console.log("Error adding category: ", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon /> Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogDescription>
                        Enter the name of the category. Click Save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category Name
                        </Label>
                        <Input
                            id="category"
                            placeholder="eg. Paste"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={categoryName}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" onClick={handleSave}>
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryButton;
