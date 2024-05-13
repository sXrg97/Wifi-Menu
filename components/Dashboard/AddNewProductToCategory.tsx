"use client";

import { ChangeEvent, useEffect, useState } from "react";
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
import { addProductToCategory } from "@/lib/actions/menu.actions";
import { toast } from "../ui/use-toast";
import { MenuType } from "@/types/types";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Loader2, PlusIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { ALLERGENS, DEFAULT_PRODUCT } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { generateSlug } from "@/lib/utils";

const AddNewProductToCategory = ({
    categoryName,
    menuId,
    setMenu,
}: {
    categoryName: string;
    menuId: string | null;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>>;
}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState({ ...DEFAULT_PRODUCT });
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const clerkUser = useUser();

    useEffect(() => {
        if (!isOpen) {
            // Dialog was closed, reset your state here
            setImagePreview(null);
            setProduct({
                ...DEFAULT_PRODUCT,
            });
            setSelectedImage(null);
        }
    }, [isOpen]);

    const handleAllergenChange = (allergen: string) => {
        if (product.allergens?.includes(allergen)) {
            setProduct((prev) => ({ ...prev, allergens: prev.allergens!.filter((a) => a !== allergen) }));
        } else {
            setProduct((prev) => ({ ...prev, allergens: [...prev.allergens!, allergen] }));
        }
    };
    

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

    if (!menuId) return null;

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'price' || e.target.name === 'reducedPrice') {
            // Don't allow negative values
            const value = parseFloat(e.target.value);
            if (value < 0) {
                return; // Ignore the input if the value is negative
            }
            setProduct((prev) => ({ ...prev, [e.target.name]: value }));
        } else {
            setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const handleSave = async () => {
        // Manual validation
        if (!product.name || !product.price || !product.description) {
            // Display an error message or prevent the save action
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill out all required fields.",
            });
            return;
        }

        try {
            setIsUpdating(true);
            const newFileName = `product_picture_${product.name}_${clerkUser.user?.id}_${Date.now()}.png`;
            const formData = new FormData();
            if (selectedImage) {
                const renamedImage = new File([selectedImage], newFileName, { type: selectedImage.type });
                formData.append("productPicture", renamedImage);
            }

            const res = await addProductToCategory(menuId, categoryName, product, formData);

            if (res) {
                toast({
                    variant: "success",
                    title: `Success! 🎉`,
                    description: `The product ${product.name} was successfully added!`,
                });
                setMenu(res);
                setIsOpen(false);
                setProduct({ ...DEFAULT_PRODUCT });
                setImagePreview(null);
            } else {
                toast({
                    variant: "destructive",
                    title: `Something went wrong! 😕`,
                    description: `Produsul ${product.name} nu a putut fi adaugat!`,
                });
            }
        } catch (error) {
            console.log("Error adding product to category: ", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-dashed border-gray-400 h-full"
                    onClick={() => setIsOpen(true)}
                >
                    <PlusIcon /> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new product to {categoryName}</DialogTitle>
                    <DialogDescription>Enter the data and save.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="productPicture" className="text-right">
                            Image
                        </Label>
                        <Input
                            type="file"
                            accept="image/*"
                            name="productPicture"
                            id="productPicture"
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
                            Name
                        </Label>
                        <Input
                            name="name"
                            type="text"
                            id="name"
                            placeholder="eg. Carbonara"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={product.name}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
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
                            value={product.price}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            name="description"
                            type="text"
                            id="description"
                            placeholder="eg. Best pasta in the world 😍"
                            className="col-span-3"
                            onChange={(e) => onChangeHandler(e)}
                            value={product.description}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Allergens:</Label>
                        <div className="flex flex-wrap gap-1 col-span-3">
                            {ALLERGENS.map((allergen) => (
                                <Badge variant={product.allergens?.includes(allergen) ? "default" : "outline"} key={`${generateSlug(product.name)}_alergen_${allergen}`} className="text-xs cursor-pointer" onClick={() => handleAllergenChange(allergen)}>{allergen}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Is discounted?</Label>
                        <Switch
                            checked={product.isReduced}
                            onCheckedChange={(e) => setProduct((prev) => ({ ...prev, isReduced: e }))}
                        />
                    </div>
                </div>

                <div className={`${product.isReduced ? "grid" : "hidden"} gap-2`}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reducedPrice" className="text-right">
                            Discount
                        </Label>
                        <Input
                            name="reducedPrice"
                            type="number"
                            id="price"
                            step={0.5} // Adjusted step for two decimal places
                            pattern="^\d*(\.\d{0,2})?$"
                            placeholder="eg. 23"
                            className="col-span-3"
                            onChange={(e) => {
                                onChangeHandler(e);
                            }}
                            value={product.reducedPrice}
                        />
                    </div>
                </div>

                <div className={`${product.isReduced ? "grid" : "hidden"} gap-2`}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Is discount procentual?</Label>
                        <Switch
                            checked={product.isDiscountProcentual}
                            onCheckedChange={(e) => setProduct((prev) => ({ ...prev, isDiscountProcentual: e }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose
                        asChild
                        onClick={() => {
                            console.log("hello");
                        }}
                    >
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSave}>
                        {isUpdating ? <Loader2 className="animate-spin" /> : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewProductToCategory;
