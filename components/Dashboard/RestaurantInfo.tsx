import React, { useEffect, useState } from "react";
import { fetchMenu, uploadMenuPreviewImage } from "@/lib/actions/menu.actions";
import {  ImageIcon, LinkIcon } from "lucide-react";
import { MenuType } from "@/types/types";
import { useToast } from "../ui/use-toast";
import AddCategoryButton from "../Backend/AddCategoryButton";
import Image from "next/image";
import Link from "next/link";
import AddNewProductToCategory from "./AddNewProductToCategory";
import { UploadButton } from "@/utils/uploadthing";
import { Skeleton } from "../ui/skeleton";
import EditRestaurantModal from "../Backend/EditRestaurantModal";
import ProductBox from "../Backend/ProductBox";
import { useUser } from "@clerk/nextjs";

const RestaurantInfo = ({ menuId }: { menuId: string | null }) => {
    const [menu, setMenu] = useState<null | MenuType>(null);
    const { toast } = useToast();

    useEffect(() => {
        const getMenu = async () => {
            try {
                if (!menuId) return;
                const responseMenu = await fetchMenu(menuId);
                if (responseMenu) {
                    setMenu(responseMenu);
                    console.log("menu", responseMenu);
                }
            } catch (error) {
                console.error("Error getting menu:", error);
            }
        };
        getMenu();
    }, [menuId]);

    
    const clerkUser = useUser();

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
                        <Link className="flex" href={`/menu/${menu.slug}`}>
                            <span>Go to website</span>
                            <LinkIcon size={12} />
                        </Link>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 mb-4">
                {menuId && 
                    <>
                        {menu && <EditRestaurantModal menu={menu} setMenu={setMenu}/>}

                        <UploadButton
                            onBeforeUploadBegin={(files) => {
                                // Preprocess files before uploading (e.g. rename them)
                                return files.map(
                                    (f) => new File([f], "coverImage_" + clerkUser.user?.id + "_" + Date.now() + "_" + f.name , { type: f.type }),
                                );
                            }}
                         className="ml-auto"
                        content={{
                            button: <div className="flex"><ImageIcon className="mr-1"/>Incarca poza de coperta</div>
                        }}
                            appearance={{
                                button: {
                                    width: '100%',
                                    padding: '8px 16px'
                                },
                                allowedContent: {
                                    display: 'none',
                                    width: "100%"
                                }
                            }}
                            endpoint="imageUploader"
                            onClientUploadComplete={async (res) => {
                                if (!res) return;
                                    try {
                                        const newMenu = await uploadMenuPreviewImage(menuId ,res[0].url)
                                        setMenu(newMenu);

                                        toast({
                                            variant: "success",
                                            title: `Success! 🎉`,
                                            description: `Poza de coperta a fost modificata cu succes!`,
                                        });
                                    } catch (error) {
                                        console.log(error);

                                        toast({
                                            variant: "destructive",
                                            title: `Ceva nu a mers bine! 😕`,
                                            description: `Poza de coperta nu a putut fi modificata!`,
                                        });
                                    }
                                    
                                }
                            }
                            onUploadError={(error: Error) => {
                                console.log(`ERROR! ${error.message}`);

                                toast({
                                    variant: "destructive",
                                    title: `Ceva nu a mers bine! 😕`,
                                    description: `Poza de coperta nu a putut fi modificata!`,
                                });
                            }}
                        />
                    </>
                }
            </div>

            <div className="flex items-center gap-4 mb-4">
                {menuId && <AddCategoryButton menuId={menuId} setMenu={setMenu} />}
            </div>

            {menu &&
                menu.categories.map((category, i) => (
                    <div key={`category_${i}`}>
                        <h3 className="categoryName font-bold text-2xl mb-2">{category.name}</h3>

                        <div className={`category-${category.name}-wrapper mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4`}>
                            {category.products.map((product, j) => (
                                <ProductBox key={`${product.name}_${j}`} product={product} admin={true} />
                            ))}

                            <AddNewProductToCategory categoryName={category.name} menuId={menuId} setMenu={setMenu} />
                        </div>
                    </div>
                )                
            )}
        </div>
    );
};

export default RestaurantInfo;
