import { Loader2, PenIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
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
import { deleteProduct } from "@/lib/actions/menu.actions";
import { MenuType } from "@/types/types";
import { useToast } from "../ui/use-toast";

type ProductType = {
    name: string;
    description: string;
    price: number;
    image?: string;
    _id?: string | null;
};

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
        if (confirm("Sunteti sigur ca doriti sa stergeti acest produs?")) {
            try {
                const responseMenu = await deleteProduct(menuId, categoryName, productId);
                if (responseMenu) {
                    toast({
                        variant: "success",
                        title: `Success! 🎉`,
                        description: `Produsul ${product.name} a fost adaugata!`,
                    });
                    setMenu && setMenu(responseMenu);
                }
            } catch (err) {
                console.log("Error deleting product:", err);
                toast({
                    variant: "destructive",
                    title: `Ceva nu a mers bine! 😕`,
                    description: `Produsul ${product.name} nu a fost sters!`,
                });
            }
        }
    };

    return (
        <div className="product-box border-gray-300 border p-4 rounded-sm hover:shadow-lg transition-shadow" key={product.name}>
            <div className="flex">
                <div className="product-info flex-1">
                    <span className="text-lg font-semibold block text-gray-800 pr-2">{product.name}</span>
                    <span className="text-base font-normal block text-gray-600 clamp-text pr-2">
                        {product.description}
                    </span>
                    <span className="text-base font-normal block text-red-500">{product.price} RON</span>
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
                    <Dialog>
                        <DialogTrigger
                            asChild
                            className="flex flex-1 p-1 rounded-sm items-center justify-center transition-color"
                        >
                            <Button variant="outline">
                                <PenIcon />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Setari meniu</DialogTitle>
                                <DialogDescription>Faceti modificarile dorite iar apoi salvati.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
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
                                        onChange={(e) => {}}
                                        // value={}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 py-4">
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
                                        onChange={(e) => {}}
                                        // value={}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={() => {}}>Inchide</Button>
                                </DialogClose>

                                {/* <Button type="submit" onClick={}> */}
                                {/* {isUpdating ? <Loader2 className="animate-spin" /> : "Salveaza"} */}
                                {/* </Button> */}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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
