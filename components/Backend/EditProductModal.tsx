"use client";

import { Loader2, PenIcon, Sparkles } from "lucide-react";
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
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const EditProductModal = ({
    product,
    menuId,
    categoryName,
    setMenu,
    subscriptionEndDate
}: {
    product: ProductType;
    menuId: string | undefined;
    categoryName: string | undefined;
    setMenu: React.Dispatch<React.SetStateAction<MenuType | null>> | undefined;
    subscriptionEndDate: string;
}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        ...product,
        nutritionalValues: product.nutritionalValues || "",
    });
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const clerkUser = useUser();
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Dialog was closed, reset your state here
            setImagePreview(null);
            setEditedProduct({ ...product, nutritionalValues: product.nutritionalValues || "" });
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

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
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

    const handleGenerateNutritionalValues = async () => {
        if (!editedProduct.description) {
            toast({
                variant: "destructive",
                title: "Eroare",
                description: "Adaugati o descriere pentru a genera valori nutritionale.",
            });
            return;
        }

        try {
            setIsGenerating(true);
            const response = await fetch('/api/generate-nutritional-values', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: editedProduct.description }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate nutritional values');
            }

            const data = await response.json();
            setEditedProduct(prev => ({ ...prev, nutritionalValues: data.nutritionalValues }));
        } catch (error) {
            console.error('Error generating nutritional values:', error);
            toast({
                variant: "destructive",
                title: "Eroare",
                description: "Nu s-au putut genera valorile nutritionale. Incercati din nou.",
            });
        } finally {
            setIsGenerating(false);
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
            editedProduct.allergens === product.allergens &&
            editedProduct.nutritionalValues === product.nutritionalValues;

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
            <DialogContent className="max-w-[90vw] md:max-w-[600px] overflow-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Editeaza produsul {product.name}</DialogTitle>
                    <DialogDescription className="flex items-start flex-col">
                        <span className="mb-2 block">Introdu detaliile si salvează.</span>

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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="productPicture" className="text-left">
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
                                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left"></span>{" "}
                                <Image alt="product image" src={imagePreview} width={100} height={100} />
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-left">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-left">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="nutritionalValues" className="md:text-left">
                            Valori Nutritionale
                        </Label>
                        <div className="col-span-3 flex gap-2 flex-col">
                            <textarea
                                name="nutritionalValues"
                                id="nutritionalValues"
                                placeholder="eg. 310 kcal, 12g proteine, 15g lipide, 35g carbohidrati"
                                className="flex-grow flex h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(e) => onChangeHandler(e)}
                                value={editedProduct.nutritionalValues}
                            />

                            <p className="text-xs text-gray-500">
                                Valorile generate cu AI sunt aproximative. Acestea se bazează pe gramajele alimentelor din descrierea produsului.
                            </p>

                            {new Date() < new Date(subscriptionEndDate!)
                                ? 
                                    <Button type="button" className={`flex-1 ${isGenerating && "bg-yellow-400"} transition-colors`} onClick={handleGenerateNutritionalValues}>
                                        {isGenerating ? <Loader2 className="animate-spin" /> : <><Sparkles className="size-5 mr-1" /> Genereaza cu AI</>}
                                    </Button>
                                :
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button variant="default" className="w-full"><Sparkles className="size-5 mr-1" /> Genereaza cu AI</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p>Aceasta este o functionalitate premium. <Link href={'/#pricing-section'} style={{textDecoration: 'underline'}}>Treceti la PRO</Link></p>
                                        </PopoverContent>
                                    </Popover>
                            }
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label className="text-left">Alergeni:</Label>
                        <div className="flex flex-wrap gap-1 col-span-3">
                            {ALLERGENS.map((allergen) => (
                                <Badge variant={editedProduct.allergens?.includes(allergen) ? "default" : "outline"} key={`${generateSlug(product.name)}_alergen_${allergen}`} className="text-xs cursor-pointer" onClick={() => handleAllergenChange(allergen)}>{getAllergenInRomanian(allergen)}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label className="text-left">Pretul e redus?</Label>
                        <Switch
                            checked={editedProduct.isReduced}
                            onCheckedChange={(e) => setEditedProduct((prev) => ({ ...prev, isReduced: e }))}
                        />
                    </div>
                </div>

                <div className={`${editedProduct.isReduced ? "grid" : "hidden"} gap-2`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="reducedPrice" className="text-left">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label className="text-left">Reducere procentuala? (%)</Label>
                        <Switch
                            checked={editedProduct.isDiscountProcentual}
                            onCheckedChange={(e) => setEditedProduct((prev) => ({ ...prev, isDiscountProcentual: e }))}
                        />
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button onClick={() => setIsOpen(false)}>Închide</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleEdit} className="bg-purple-500">
                        {isUpdating ? <Loader2 className="animate-spin" /> : "Salvează"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
