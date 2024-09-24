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
import { Loader2, PlusIcon, Sparkles } from "lucide-react";
import { Switch } from "../ui/switch";
import { ALLERGENS, DEFAULT_PRODUCT } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { generateSlug, getAllergenInRomanian } from "@/lib/utils";

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
    const [isGenerating, setIsGenerating] = useState(false);

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

    
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
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
                description: "Va rugam completati toate campurile necesare.",
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

            const res = await addProductToCategory(menuId, categoryName, {
                ...product,
            }, formData);

            if (res) {
                toast({
                    variant: "success",
                    title: `Succes! 🎉`,
                    description: `Produsul ${product.name} a fost adaugat cu succes!`,
                });
                setMenu(res);
                setIsOpen(false);
                setProduct({ ...DEFAULT_PRODUCT });
                setImagePreview(null);
            } else {
                toast({
                    variant: "destructive",
                    title: `Ceva nu a mers bine! 😕`,
                    description: `Produsul ${product.name} nu a putut fi adaugat!`,
                });
            }
        } catch (error) {
            console.log("Error adding product to category: ", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleGenerateNutritionalValues = async () => {
        if (!product.description) {
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
                body: JSON.stringify({ description: product.description }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate nutritional values');
            }

            const data = await response.json();
            setProduct((prev) => ({ ...prev, nutritionalValues: data.nutritionalValues }));
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-dashed border-gray-400 h-full"
                    onClick={() => setIsOpen(true)}
                >
                    <PlusIcon /> Produs
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-[600px] overflow-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Adauga un produs nou in categoria {categoryName}</DialogTitle>
                    <DialogDescription>Introduceti datele si salvati.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="productPicture" className="md:text-left">
                            Imagine
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
                                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"></span>{" "}
                                <Image alt="product image" src={imagePreview} width={100} height={100} />
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="md:text-left">
                            Nume *
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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="md:text-left">
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
                            value={product.price}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="md:text-left">
                            Descriere *
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
                                value={product.nutritionalValues}
                            />
                            
                            <p className="text-xs text-gray-500">
                                Valorile generate cu AI sunt aproximative. Acestea se bazează pe gramajele alimentelor din descrierea produsului.
                            </p>

                            <Button type="button" className={`flex-1 ${isGenerating && "bg-yellow-400"} transition-colors`} onClick={handleGenerateNutritionalValues}>
                                {isGenerating ? <Loader2 className="animate-spin" /> : <><Sparkles className="size-5 mr-1" /> Genereaza cu AI</>}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label className="md:text-left">Alergeni:</Label>
                        <div className="flex flex-wrap gap-1 col-span-3">
                            {ALLERGENS.map((allergen) => (
                                <Badge variant={product.allergens?.includes(allergen) ? "default" : "outline"} key={`${generateSlug(product.name)}_alergen_${allergen}`} className="text-xs cursor-pointer" onClick={() => handleAllergenChange(allergen)}>{getAllergenInRomanian(allergen)}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label className="md:text-left">Pretul e redus?</Label>
                        <Switch
                            checked={product.isReduced}
                            onCheckedChange={(e) => setProduct((prev) => ({ ...prev, isReduced: e }))}
                        />
                    </div>
                </div>

                <div className={`${product.isReduced ? "grid" : "hidden"} gap-2`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label htmlFor="reducedPrice" className="md:text-left">
                            Reducere
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
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <Label className="md:text-left">Reducere procentuala? (%)</Label>
                        <Switch
                            checked={product.isDiscountProcentual}
                            onCheckedChange={(e) => setProduct((prev) => ({ ...prev, isDiscountProcentual: e }))}
                        />
                    </div>
                </div>
                <DialogFooter className="flex flex-col md:flex-row gap-2">
                    <Button type="submit" onClick={handleSave} className="bg-purple-500">
                        {isUpdating ? <Loader2 className="animate-spin" /> : "Salvează"}
                    </Button>
                    <DialogClose
                        asChild
                    >
                        <Button onClick={() => setIsOpen(false)}>Închide</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewProductToCategory;
