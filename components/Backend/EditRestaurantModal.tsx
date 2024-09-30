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
import Image from "next/image";

const EditRestaurantModal = ({
    menu,
    setMenu,
}: {
    menu: MenuType;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>>;
}) => {
    const { _id, restaurantName, slug, tables, menuPreviewImage } = menu;

    const [formFields, setFormFields] = useState({
        restaurantName,
        slug,
        tables: tables.length,
    });

    const [restaurantCoverImage, setRestaurantCoverImage] = useState<File | null>(null);

    const [isUpdating, setIsUpdating] = useState(false);

    const handleSave = async () => {
        setIsUpdating(true);

        const formData = new FormData();
        if (restaurantCoverImage) {
            formData.append("restaurantCoverImage", restaurantCoverImage);
        }

        const res = await UpdateMenuInfo(_id, formFields.restaurantName, formFields.slug, formFields.tables, formData);

        if (res.status !== 200) {
            toast({
                variant: "destructive",
                title: `Ceva nu a mers bine! 😕`,
                description: `${res.message}`,
            });
        } else {
            toast({
                variant: "success",
                title: `Succes! 🎉`,
                description: `Meniul a fost actualizat cu succes!`,
            });

            setMenu(res.jsonifiedUpdatedMenu);
        }

        setIsUpdating(false);
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "slug") {
            setFormFields((prev) => ({ ...prev, [e.target.name]: generateSlug(e.target.value) }));
        } else if (e.target.name === "restaurantCoverImage") {
            setRestaurantCoverImage(e.target.files?.[0] || null);
        } else {
            setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild className="flex">
                <Button variant="outline" className="edit-menu-button">
                    <PenIcon className="mr-1" />
                    Editeaza meniu
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-[600px] overflow-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Setari meniu</DialogTitle>
                    <DialogDescription>Faceti modificarile apoi apasati salvează.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="restaurantName" className="text-left">
                            Nume restaurant
                        </Label>
                        <Input
                            name="restaurantName"
                            type="text"
                            id="restaurantName"
                            placeholder="eg. McDonalds"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={formFields.restaurantName}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="restaurantCoverImage" className="text-left">
                            Poza restaurant
                        </Label>
                        <Input
                            name="restaurantCoverImage"
                            type="file"
                            id="restaurantCoverImage"
                            accept="image/*"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                        />
                    </div>
                </div>

                {menuPreviewImage && (
                    <div className="grid gap-2">
                        <div className="col-span-4 flex justify-center">
                            <Image width={1600} height={900} src={menuPreviewImage} alt="Restaurant Cover" className="w-full object-cover aspect-video" />
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-left">
                            Slug (url)
                        </Label>
                        <Input
                            name="slug"
                            type="text"
                            id="slug"
                            placeholder="meniul-meu"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={formFields.slug}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="tables" className="text-left">
                            Mese
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
                <DialogFooter className="flex flex-col md:flex-row gap-2">
                    <Button type="submit" onClick={handleSave} className="bg-purple-500">
                        {isUpdating ? <Loader2 className="animate-spin" /> : "Salvează"}
                    </Button>

                    <DialogClose asChild>
                        <Button onClick={() => setFormFields({ restaurantName, slug, tables: tables.length })}>
                            Închide
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditRestaurantModal;
