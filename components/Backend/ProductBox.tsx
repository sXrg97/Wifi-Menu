import { Loader2, PenIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"

type ProductType = {
    name: string,
    description: string,
    price: number,
    image?: string
    _id?: string
}


// TODO: Fix this page

const ProductBox = ({ product, admin }: { product: ProductType, admin: boolean }) => {
    return (
        <div className="product-box border-gray-300 border p-4 rounded-sm" key={product.name}>
            <div className="flex">
                <div className="product-info flex-1">
                    <span className="text-lg font-semibold block text-gray-800">{product.name}</span>
                    <span className="text-base font-normal block text-gray-600">{product.description}</span>
                    <span className="text-base font-normal block text-red-500">{product.price} RON</span>
                </div>

                <div className="product-image flex-1 w-full h-full object-cover overflow-hidden aspect-square">
                    <Image className="h-full object-cover" src={product.image || "/dashboard-cover.webp"} alt={product.description} width={320} height={180} />
                </div>
            </div>

            {admin && <div className="flex w-full mt-2 gap-5">

                <Dialog>
                    <DialogTrigger asChild className="flex flex-1 p-1 rounded-sm items-center justify-center transition-color">
                        <Button variant="outline">
                                <PenIcon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Setari meniu</DialogTitle>
                            <DialogDescription>
                                Faceti modificarile dorite iar apoi salvati.
                            </DialogDescription>
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
                                    onChange={(e) => {} }
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
                                    onChange={(e) => {} }
                                    // value={}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button onClick={() => {}}>
                                    Inchide
                                </Button>
                            </DialogClose>

                            {/* <Button type="submit" onClick={}> */}
                                {/* {isUpdating ? <Loader2 className="animate-spin" /> : "Salveaza"} */}
                            {/* </Button> */}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <button className="bg-red-500 text-black p-1 rounded-sm flex flex-1 items-center justify-center hover:bg-red-600 transition-colors">
                    <Trash2Icon />
                </button>
            </div>}
        </div>
    )
}

export default ProductBox