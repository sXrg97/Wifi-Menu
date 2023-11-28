import React, { useEffect, useState } from "react";
import { fetchMenu, uploadMenuPreviewImage } from "@/lib/actions/menu.actions";
import { Check, LinkIcon, Pencil, X } from "lucide-react";
import { MenuType } from "@/types/types";
import { useToast } from "../ui/use-toast";
import AddCategoryButton from "../Backend/AddCategoryButton";
import Image from "next/image";
import Link from "next/link";
import AddNewProductToCategory from "./AddNewProductToCategory";
import { UploadButton } from "@/utils/uploadthing";
import { Skeleton } from "../ui/skeleton";
import EditRestaurantModal from "../Backend/EditRestaurantModal";

const RestaurantInfo = ({ menuId }: { menuId: string | null }) => {
    const [menu, setMenu] = useState<null | MenuType>(null);
    const [restaurantNameInput, setRestaurantNameInput] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const getMenu = async () => {
            try {
                if (!menuId) return;
                const responseMenu = await fetchMenu(menuId);
                if (responseMenu) {
                    setMenu(responseMenu);
                    console.log(responseMenu);
                    setRestaurantNameInput(responseMenu.restaurantName);
                }
            } catch (error) {
                console.error("Error getting menu:", error);
            }
        };
        getMenu();
    }, [menuId]);

    // const handleCancelEdit = () => {
    //     // Reset the input field value and set editable to false
    //     setRestaurantNameInput(menu?.restaurantName || "");
    //     setEditable(false);
    // };

    return (
        <div>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg relative mb-4">
                {menu ? 
                <Image
                className="bg-black"
                alt="Restaurant Cover Image"
                src={`${menu?.menuPreviewImage ? menu.menuPreviewImage : '/dashboard-cover.webp'}`}
                // to fix the image showing the preview before loading the menu
                width={1600}
                height={1200}
                />

                : <Skeleton className="w-full h-full bg-black"/>
                }
                
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>
                {menu && (
                    <div className="absolute top-0 left-0 text-white flex items-center justify-between w-full px-4 py-3">
                        <span className="text-2xl">{menu.restaurantName}</span>
                        <Link className="flex" href={`/menu/${menuId}`}>
                            <span>Go to website</span>
                            <LinkIcon size={12} />
                        </Link>
                    </div>
                )}
            </div>

            {menu && <EditRestaurantModal menu={menu} />}

            <div className="flex items-center gap-4">{menuId && 
            <>
                <AddCategoryButton menuId={menuId} setMenu={setMenu} />

                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                    // Do something with the response
                    if (!res) return;
                    console.log("Files: ", res[0].url);
                    uploadMenuPreviewImage(menuId ,res[0].url)
                    }}
                    onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                    }}
                />
            </>
                
                }
            </div>
            {menu &&
                menu.categories.map((category, i) => (
                    <div key={`category_${i}`} className={`category-${category.name}-wrapper mb-4`}>
                        <h3 className="categoryName font-bold text-2xl mb-2">{category.name}</h3>
                        {category.products.map((product) => (
                            <div className="mb-4" key={product.name}>
                                <span className="text-lg font-semibold block text-gray-800">{product.name}</span>
                                <span className="text-base font-normal block text-gray-600">{product.description}</span>
                                <span className="text-base font-normal block text-red-500">{product.price} RON</span>
                            </div>
                        ))}
                        <AddNewProductToCategory categoryName={category.name} menuId={menuId} setMenu={setMenu} />
                    </div>
                ))}
        </div>
    );
};

export default RestaurantInfo;
