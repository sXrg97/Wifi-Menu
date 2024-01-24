"use client";

import { ChangeEvent, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "../ui/use-toast";
import { MenuType } from "@/types/types";
import { UpdateMenuInfo } from "@/lib/actions/menu.actions";
import { Loader2, PenIcon } from "lucide-react";
import { generateSlug } from "@/lib/utils";

const EditRestaurantModal = ({
    menu,
    setMenu,
}: {
    menu: MenuType;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>>;
}) => {
    const { _id, restaurantName, slug, tables } = menu;

    const [formFields, setFormFields] = useState({
        restaurantName,
        slug,
        //tables but count the array objects and add 1
        tables: tables.length,
    });

    const [isUpdating, setIsUpdating] = useState(false);

    const handleSave = async () => {
        setIsUpdating(true);
        console.log("updating true");

        const res = await UpdateMenuInfo(_id, formFields.restaurantName, formFields.slug, formFields.tables);

        console.log(res);

        if (res.status !== 200) {
            toast({
                variant: "destructive",
                title: `Ceva nu a mers bine! 😕`,
                description: `${res.message}`,
            });
        } else {
            toast({
                variant: "success",
                title: `Success! 🎉`,
                description: `Meniul a fost actualizat cu succes!`,
            });

            setMenu(res.jsonifiedUpdatedMenu);
        }

        setIsUpdating(false);
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.name === "slug"
            ? setFormFields((prev) => ({ ...prev, [e.target.name]: generateSlug(e.target.value) }))
            : setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild className="flex">
                <Button variant="outline">
                    <PenIcon className="mr-1" />
                    Editeaza meniu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Setari meniu</DialogTitle>
                    <DialogDescription>Faceti modificarile dorite iar apoi salvati.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="restaurantName" className="text-right">
                            Nume restaurant
                        </Label>
                        <Input
                            name="restaurantName"
                            type="text"
                            id="restaurantName"
                            placeholder="ex. McDonalds"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={formFields.restaurantName}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">
                            Slug
                        </Label>
                        <Input
                            name="slug"
                            type="text"
                            id="slug"
                            placeholder=""
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={formFields.slug}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tables" className="text-right">
                            Tables
                        </Label>
                        <Input
                            name="tables"
                            type="number"
                            id="tables"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={formFields.tables}
                            min={0}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => setFormFields({ restaurantName, slug, tables: tables.length })}>Inchide</Button>
                    </DialogClose>

                    <Button type="submit" onClick={handleSave}>
                        {isUpdating ? <Loader2 className="animate-spin" /> : "Salveaza"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditRestaurantModal;
