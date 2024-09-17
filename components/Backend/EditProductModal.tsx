"use client";

import { Loader2, PenIcon } from "lucide-react";
import { Button } from "../ui/button";
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
import { MenuType, ProductType } from "@/types/types";
import { Switch } from "../ui/switch";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { toast } from "../ui/use-toast";
import { editProduct, editProductAndImage, editProductImage } from "@/lib/actions/menu.actions";
import { Badge } from "../ui/badge";
import { ALLERGENS } from "@/lib/constants";
import { generateSlug, getAllergenInRomanian } from "@/lib/utils";

const EditProductModal = ({
    product,
    menuId,
    categoryName,
    setMenu,
}: {
    product: ProductType;
    menuId: string | undefined;
    categoryName: string | undefined;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>> | undefined;
}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const clerkUser = useUser();

    useEffect(() => {
        if (!isOpen) {
            // Dialog was closed, reset your state here
            setImagePreview(null);
            setEditedProduct({ ...product });
            setSelectedImage(null);
        }
    }, [isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedImage(file);

        // Display a preview of the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleAllergenChange = (allergen: string) => {

        if (editedProduct.allergens?.includes(allergen)) {
            setEditedProduct((prev) => ({ ...prev, allergens: prev.allergens!.filter((a) => a !== allergen) }));
        } else {
            setEditedProduct((prev) => ({ ...prev, allergens: [...prev.allergens!, allergen] }));
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        if (name === 'price' || name === 'reducedPrice') {
            // Don't allow negative values
            const parsedValue = parseFloat(value);
            if (parsedValue < 0) {
                return; // Ignore the input if the value is negative
            }
            setEditedProduct((prev) => ({ ...prev, [name]: parsedValue }));
        } else {
            setEditedProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEdit = async () => {
        let notModified =
            editedProduct.name === product.name &&
            editedProduct.price === product.price &&
            editedProduct.description === product.description &&
            editedProduct.isReduced === product.isReduced &&
            editedProduct.reducedPrice === product.reducedPrice &&
            editedProduct.isDiscountProcentual === product.isDiscountProcentual &&
            editedProduct.allergens === product.allergens;

        if (notModified && !selectedImage) {
            setIsOpen(false);
            toast({
                variant: "default",
                title: `Nimic de editat!`,
                description: `Nu ati modificat nimic!`,
            });
            return;
        }

        setIsUpdating(true);
        let formData = new FormData();

        if (selectedImage) {
            const newFileName = `product_picture_${product.name}_${clerkUser.user?.id}_${Date.now()}.png`;

            const renamedImage = new File([selectedImage], newFileName, {
                type: selectedImage.type,
            });

            formData.append("productPicture", renamedImage);
        }

        if (formData.get("productPicture") && notModified) {
            setIsUpdating(true);
            try {
                const responseMenu = await editProductImage(menuId!, categoryName!, product._id!, formData);
                if (responseMenu) {
                    toast({
                        variant: "success",
                        title: `Succes! 🎉`,
                        description: `Imaginea produsului ${product.name} a fost modificata cu succes!`,
                    });
                    setMenu && setMenu(responseMenu);
                    setIsOpen(false);
                    setIsUpdating(false);
                }
            } catch (err) {
                console.log("Error updating product:", err);
                toast({
                    variant: "destructive",
                    title: `Ceva nu a mers bine! 😕`,
                    description: `Produsul ${product.name} nu a fost modificat!`,
                });
            }
        } else if (!formData.get("productPicture") && !notModified) {
            setIsUpdating(true);
            try {
                const responseMenu = await editProduct(menuId!, categoryName!, product._id!, editedProduct);
                if (responseMenu) {
                    toast({
                        variant: "success",
                        title: `Succes! 🎉`,
                        description: `Produsul ${product.name} a fost modificat!`,
                    });
                    setMenu && setMenu(responseMenu);
                    setIsOpen(false);
                    setIsUpdating(false);
                }
            } catch (err) {
                console.log("Error updating product:", err);
                toast({
                    variant: "destructive",
                    title: `Ceva nu a mers bine! 😕`,
                    description: `Produsul ${product.name} nu a fost modificat!`,
                });
            }
        } else {
            setIsUpdating(true);
            try {
                const responseMenu = await editProductAndImage(
                    menuId!,
                    categoryName!,
                    product._id!,
                    editedProduct,
                    formData
                );
                if (responseMenu) {
                    toast({
                        variant: "success",
                        title: `Succes! 🎉`,
                        description: `Produsul ${product.name} a fost modificat!`,
                    });
                    setMenu && setMenu(responseMenu);
                    setIsOpen(false);
                    setIsUpdating(false);
                }
            } catch (err) {
                console.log("Error updating product:", err);
                toast({
                    variant: "destructive",
                    title: `Ceva nu a mers bine! 😕`,
                    description: `Produsul ${product.name} nu a fost modificat!`,
                });
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 border-gray-400 h-full" onClick={() => setIsOpen(true)}>
                    <PenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80dvh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Editeaza produsul {product.name}</DialogTitle>
                    <DialogDescription className="flex items-start flex-col">
                        <span className="mb-2 block">Introdu detaliile si salveaza.</span>

                        {product.image && (
                            <div className="h-32 w-32 object-cover overflow-hidden">
                                <Image
                                    className="h-full w-full object-cover"
                                    alt="product image"
                                    src={product.image}
                                    width={300}
                                    height={300}
                                />
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="productPicture" className="text-right">
                            Imagine
                        </Label>
                        <Input
                            type="file"
                            accept="image/*"
                            name="productPicture"
                            id="productPicture"
                            placeholder="Incarca imaginea ta"
                            className="col-span-3"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <>
                                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right"></span>{" "}
                                <Image alt="product image" src={imagePreview} width={100} height={100} />
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nume *
                        </Label>
                        <Input
                            name="name"
                            type="text"
                            id="name"
                            placeholder="eg. Carbonara"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={editedProduct.name}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Pret *
                        </Label>
                        <Input
                            name="price"
                            type="number"
                            id="price"
                            min={0}
                            step={0.5} // Adjusted step for two decimal places
                            pattern="^\d*(\.\d{0,2})?$"
                            placeholder="eg. 23"
                            className="col-span-3"
                            onChange={(e) => {
                                onChangeHandler(e);
                            }}
                            value={editedProduct.price}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Descriere *
                        </Label>
                        <Input
                            name="description"
                            type="text"
                            id="description"
                            placeholder="eg. Cele mai bune paste din lume 😍"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={editedProduct.description}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Alergeni:</Label>
                        <div className="flex flex-wrap gap-1 col-span-3">
                            {ALLERGENS.map((allergen) => (
                                <Badge variant={editedProduct.allergens?.includes(allergen) ? "default" : "outline"} key={`${generateSlug(product.name)}_alergen_${allergen}`} className="text-xs cursor-pointer" onClick={() => handleAllergenChange(allergen)}>{getAllergenInRomanian(allergen)}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Pretul e redus?</Label>
                        <Switch
                            checked={editedProduct.isReduced}
                            onCheckedChange={(e) => setEditedProduct((prev) => ({ ...prev, isReduced: e }))}
                        />
                    </div>
                </div>

                <div className={`${editedProduct.isReduced ? "grid" : "hidden"} gap-2`}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reducedPrice" className="text-right">
                            Reducere
                        </Label>
                        <Input
                            name="reducedPrice"
                            type="number"
                            id="price"
                            step={0.5} // Adjusted step for two decimal places
                            pattern="^\d*(\.\d{0,2})?$"
                            placeholder="eg. 23"
                            min={0.1}
                            className="col-span-3"
                            onChange={(e) => {
                                onChangeHandler(e);
                            }}
                            value={editedProduct.reducedPrice}
                        />
                    </div>
                </div>

                <div className={`${editedProduct.isReduced ? "grid" : "hidden"} gap-2`}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Reducere procentuala? (%)</Label>
                        <Switch
                            checked={editedProduct.isDiscountProcentual}
                            onCheckedChange={(e) => setEditedProduct((prev) => ({ ...prev, isDiscountProcentual: e }))}
                        />
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button onClick={() => setIsOpen(false)}>Inchide</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleEdit}>
                        {isUpdating ? <Loader2 className="animate-spin" /> : "Salveaza"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
