import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { deleteProduct } from "@/lib/actions/menu.actions";
import { MenuType, ProductType } from "@/types/types";
import { useToast } from "../ui/use-toast";
import EditProductModal from "./EditProductModal";
import { calculateDiscountedPrice } from "@/lib/utils";

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
        //TODO: Add a confirmation dialog with shadcn maybe
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const responseMenu = await deleteProduct(menuId, categoryName, productId);
                if (responseMenu) {
                    toast({
                        variant: "success",
                        title: `Success! 🎉`,
                        description: `The product ${product.name} has been added!`,
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
        <div
            className={`border-gray-300 product-box border p-4 rounded-sm hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col justify-between gap-4`}
            key={product.name}
        >
            <div
                className={`${
                    product.isReduced ? "block" : "hidden"
                } product-flags absolute top-7 -right-10 bg-red-500 rotate-45 z-30 py-1 px-10 text-white font-bold`}
            >
                DISCOUNT!
            </div>
            <div className="flex h-full">
                <div className="product-info flex-1 flex flex-col">
                    <span className="text-lg font-semibold block text-gray-800 pr-2">{product.name}</span>
                    <span className="text-base font-normal block text-gray-600 clamp-text pr-2 min-h-16 mb-8">
                        {product.description}
                    </span>
                    <div className="price-container mt-auto">
                        {product.isReduced ? (
                            <div className="flex flex-col">
                                <span className="font-bold text-red-500">
                                    {product.reducedPrice &&
                                        `${calculateDiscountedPrice(
                                            product.price,
                                            product.reducedPrice,
                                            product.isDiscountProcentual!
                                        )} USD (-${
                                            product.isDiscountProcentual
                                                ? `${product.reducedPrice}%`
                                                : `${product.reducedPrice} USD`
                                        })`}
                                </span>
                                <span className="text-base block line-through text-gray-500">{product.price} USD</span>
                            </div>
                        ) : (
                            <span className="text-base block font-bold">{product.price} USD</span>
                        )}
                    </div>
                </div>

                <div className="product-image flex-1 w-full h-full object-cover overflow-hidden aspect-square">
                    <Image
                        className="h-full object-cover"
                        src={product.image || "/dashboard-cover.webp"}
                        alt={product.description}
                        width={320}
                        height={180}
                    />
                </div>
            </div>

            {admin && (
                <div className="flex w-full mt-2 gap-5">
                    <EditProductModal product={product} menuId={menuId} categoryName={categoryName} setMenu={setMenu} />

                    {product._id && menuId && categoryName && (
                        <Button
                            className="bg-red-500 text-black p-1 rounded-sm flex flex-1 items-center justify-center hover:bg-red-600 transition-colors"
                            onClick={() => handleDeleteProduct(menuId, categoryName, product._id!)}
                        >
                            <Trash2Icon />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductBox;
