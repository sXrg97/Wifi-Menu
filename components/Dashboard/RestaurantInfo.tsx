"use client"

import React, { useEffect, useState } from "react";
import { deleteCategory, fetchMenu } from "@/lib/actions/menu.actions";
import { LinkIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { MenuType, ProductType } from "@/types/types";
import { useToast } from "../ui/use-toast";
import AddCategoryButton from "../Backend/AddCategoryButton";
import Image from "next/image";
import Link from "next/link";
import AddNewProductToCategory from "./AddNewProductToCategoryModal";
import { Skeleton } from "../ui/skeleton";
import EditRestaurantModal from "../Backend/EditRestaurantModal";
import ProductBox from "../Backend/ProductBox";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import EditCategoryNameButton from "../Backend/EditCategoryNameButton";
import ImportantUpdates from "./ImportantUpdates";
import QRPreviewer from "./QRPreviewer";
import ProductModal from '../Frontend/ProductModal';
import TourGuideDashboard from "../Backend/TourGuideDashboard";

const RestaurantInfo = ({ menuId }: { menuId: string | null }) => {
    const [menu, setMenu] = useState<null | MenuType>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleDeleteCategory = async (menuId: string, categoryName: string) => {
        if (!menuId) return;
        if (!categoryName) return;

        if (!confirm("Ești sigur că vrei să ștergi această categorie?")) return;

        try {
            setIsPageLoading(true);
            const response = await deleteCategory(menuId, categoryName);

            if (response) {
                setMenu(response);

                toast({
                    variant: "success",
                    title: `Succes! 🎉`,
                    description: `Categoria ${categoryName} a fost stearsa cu succes!`,
                });
            }
        } catch (err) {
            console.log("Error deleting category:", err);
            toast({
                variant: "destructive",
                title: `Ceva nu a mers bine! 😕`,
                description: `Categoria ${categoryName} nu a putut fi stearsa!`,
            });
        } finally {
            setIsPageLoading(false);
        }
    };

    const clerkUser = useUser();

    const openModal = (product: ProductType) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    return (
        <div>
        {menu && !menu.hasFinishedTutorial && <TourGuideDashboard />}
            <div className="w-full mb-8">{menu && <ImportantUpdates menuId={menu._id} />}</div>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg relative mb-4">
                {menu ? (
                    <Image
                        className="bg-black w-full object-cover h-full"
                        alt="Restaurant Cover Image"
                        src={`${menu?.menuPreviewImage || "/dashboard-cover.webp"}`}
                        // to fix the image showing the preview before loading the menu
                        width={1600}
                        height={1200}
                        quality={100}
                    />
                ) : (
                    <Skeleton className="w-full h-full bg-black" />
                )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    {menu && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 md:flex-row items-center justify-between">
                            <h1 className="text-4xl font-bold text-white">{menu.restaurantName}</h1>
                            <Link href={`/menu/${menu.slug}`} className="flex items-center space-x-2 bg-white dark:bg-gray-900 hover:bg-purple-200 transition-colors px-4 py-2 rounded-full">
                                <span>Vizualizeaza meniul</span>
                                <LinkIcon size={16} />
                            </Link>
                        </div>
                    )}
            </div>


            {menu && <span className="italic text-gray-400 mb-4 block">Vizualizari: {menu.lifetimeViews}</span>}


            <div className="flex items-center gap-4 mb-6">
                {menuId && (
                    <>
                        {menu && <EditRestaurantModal menu={menu} setMenu={setMenu} />}
                    </>
                )}
            </div>

            {menu && menu.tables && (
    <div className="flex items-center gap-x-8 gap-y-4 mb-6 flex-wrap">
        <div className="flex gap-2 see-table-button">
            <Button variant={"outline"}>
                <Link href={`/menu/${menu.slug}`}>
                    Vezi meniul
                </Link>
            </Button>
            <QRPreviewer menuName={menu.restaurantName} slug={menu.slug} />
        </div>
        {menu.tables.map((table, i) => (
            <div className="flex gap-2 see-table-button" key={`table_${table.tableNumber}`}>
                <Button variant={"outline"}>
                    <Link href={`/menu/${menu.slug}?table=${table.tableNumber}`}>
                        Vezi masa {table.tableNumber}
                    </Link>
                </Button>
                <QRPreviewer menuName={menu.restaurantName} slug={menu.slug} tableNumber={table.tableNumber} />
            </div>
        ))}
    </div>
)}

            <div className="flex items-center gap-4 mb-4">
                {menuId && <AddCategoryButton menuId={menuId} setMenu={setMenu} />}
            </div>

            {menu && menu.categories && 
                menu.categories.map((category, i) => (
                    <div className="mb-8" key={`category_${i}`}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="categoryName font-bold text-2xl">{category.name}</h3>

                            <div className="category-actions flex gap-2">
                                {menuId && (
                                    <EditCategoryNameButton
                                        menuId={menuId}
                                        categoryName={category.name}
                                        setMenu={setMenu}
                                        setIsPageLoading={setIsPageLoading}
                                    />
                                )}

                                {menuId && (
                                    <Button 
                                        variant={'outline'}
                                        className="text-black dark:text-white p-1 rounded-sm flex flex-1 items-center justify-center hover:bg-red-100 dark:hover:bg-red-400 w-10"
                                        onClick={() => handleDeleteCategory(menuId, category.name)}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div
                            className={`category-${category.name}-wrapper mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}
                        >
                            <div className="category-actions col-span-full">
                                {/* <Button variant={'default'} className="col-span-1">
                                    <Link href={`/dashboard/sortproducts/${i}`}>
                                        Reordoneaza produsele
                                    </Link>
                                </Button> */}

                            </div>
                            {menuId &&
                                category.products.map((product, j) => (
                                    <ProductBox
                                        key={`${product.name}_${j}`}
                                        product={product}
                                        admin={true}
                                        menuId={menuId}
                                        categoryName={category.name}
                                        setMenu={setMenu}
                                        openModal={openModal}
                                        subscriptionEndDate={menu.subscriptionEndDate}
                                    />
                                ))}

                            <AddNewProductToCategory categoryName={category.name} menuId={menuId} setMenu={setMenu} hasFinishedTutorial={menu.hasFinishedTutorial} subscriptionEndDate={menu.subscriptionEndDate} />
                        </div>
                    </div>
                ))}
            {isPageLoading && (
                <div className="overlay-loading fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md flex items-center justify-center">
                    <Loader2Icon className="animate-spin text-black" size={64} />
                </div>
            )}
        </div>
    );
};

export default RestaurantInfo;
