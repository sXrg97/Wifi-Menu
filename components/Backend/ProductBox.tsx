import React from "react";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { deleteProduct } from "@/lib/actions/menu.actions";
import { MenuType, ProductType } from "@/types/types";
import { useToast } from "../ui/use-toast";
import EditProductModal from "./EditProductModal";
import { calculateDiscountedPrice, getAllergenInRomanian } from "@/lib/utils";
import { Badge } from "../ui/badge";

const ProductBox = ({
    product,
    admin,
    menuId,
    categoryName,
    setMenu,
}: {
    product: ProductType;
    admin: boolean;
    menuId?: string;
    categoryName?: string;
    setMenu?: React.Dispatch<React.SetStateAction<MenuType | null>>;
}) => {
    const { toast } = useToast();

    const handleDeleteProduct = async (menuId: string, categoryName: string, productId: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const responseMenu = await deleteProduct(menuId, categoryName, productId);
                if (responseMenu) {
                    toast({
                        variant: "success",
                        title: `Success! 🎉`,
                        description: `The product ${product.name} has been deleted!`,
                    });
                    setMenu && setMenu(responseMenu);
                }
            } catch (err) {
                console.log("Error deleting product:", err);
                toast({
                    variant: "destructive",
                    title: `Something went wrong! 😕`,
                    description: `The product ${product.name} wasn't deleted!`,
                });
            }
        }
    };

    return (
        <div className="h-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
            <div className="relative">
                <div className="aspect-square w-full overflow-hidden">
                    <Image
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        src={product.image || "/dashboard-cover.webp"}
                        alt={product.description}
                        width={960}
                        height={960}
                    />
                </div>
                {product.isReduced && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                        DISCOUNT!
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="mt-auto">
                    <div className="mb-2">
                        {product.isReduced ? (
                            <div className="flex flex-col">
                                <span className="font-bold text-red-500">
                                    {product.reducedPrice &&
                                        `${calculateDiscountedPrice(
                                            product.price,
                                            product.reducedPrice,
                                            product.isDiscountProcentual!
                                        )} RON (-${
                                            product.isDiscountProcentual
                                                ? `${product.reducedPrice}%`
                                                : `${product.reducedPrice} RON`
                                        })`}
                                </span>
                                <span className="text-sm line-through text-gray-500">{product.price} RON</span>
                            </div>
                        ) : (
                            <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                                {product.price === 0 ? "FREE" : `${product.price} RON`}
                            </span>
                        )}
                    </div>

                    {product.allergens && product.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {product.allergens.map((allergen, index) => (
                                <Badge variant="outline" key={index} className="text-xs px-2 py-1">
                                    {getAllergenInRomanian(allergen)}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {admin && (
                <div className="p-4 bg-neutral-200 dark:bg-purple-800 flex justify-between items-center gap-2">
                
                    <EditProductModal product={product} menuId={menuId} categoryName={categoryName} setMenu={setMenu} />

                    {product._id && menuId && categoryName && (
                        <Button
                            variant="outline"
                            className="flex-1 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 dark:bg-black border border-gray-400 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                            onClick={() => handleDeleteProduct(menuId, categoryName, product._id!)}
                        >
                            <Trash2Icon className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductBox;