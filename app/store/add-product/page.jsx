'use client'
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UploadIcon } from "lucide-react"
import { addProduct } from "@/lib/features/store/storeSlice"

export default function StoreAddProduct() {

    const dispatch = useDispatch()
    const router = useRouter()

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']

    const [imageFiles, setImageFiles] = useState([null, null, null, null])
    const [imagePreviews, setImagePreviews] = useState(['', '', '', ''])
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onImageChange = (index, file) => {
        if (!file) return
        const updatedFiles = [...imageFiles]
        updatedFiles[index] = file
        setImageFiles(updatedFiles)

        const updatedPreviews = [...imagePreviews]
        updatedPreviews[index] = URL.createObjectURL(file)
        setImagePreviews(updatedPreviews)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        const files = imageFiles.filter((file) => file !== null)

        if (files.length === 0) {
            toast.error('Please add at least one image')
            setLoading(false)
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', Number(productInfo.mrp))
            formData.append('price', Number(productInfo.price))
            formData.append('category', productInfo.category)
            files.forEach((file) => formData.append('images', file))

            const result = await dispatch(addProduct(formData)).unwrap()

            setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "" })
            setImageFiles([null, null, null, null])
            setImagePreviews(['', '', '', ''])
            router.push('/store/manage-product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div className="flex flex-wrap gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                    <label key={index} htmlFor={`image-${index}`} className="cursor-pointer">
                        <input
                            id={`image-${index}`}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => onImageChange(index, e.target.files[0])}
                        />
                        <div className="w-24 h-24 border border-dashed border-slate-300 rounded flex items-center justify-center overflow-hidden bg-slate-50 hover:bg-slate-100 transition">
                            {preview ? (
                                <Image src={preview} alt="" width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                                <UploadIcon size={20} className="text-slate-400" />
                            )}
                        </div>
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}